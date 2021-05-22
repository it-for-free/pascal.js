import { Scope } from './Scope';
import { ScalarVariable } from './Variables/ScalarVariable';
import { TypesIds } from './Variables/TypesIds';
import { VariablesDeclaration } from '../SyntaxAnalyzer/Tree/VariablesDeclaration';
import { SimpleVariablesType } from '../SyntaxAnalyzer/Tree/Types/SimpleVariablesType';
import { Identifier } from '../SyntaxAnalyzer/Tree/Identifier';
import { Assignation } from '../SyntaxAnalyzer/Tree/Assignation';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { Constant } from '../SyntaxAnalyzer/Tree/Constant';
import { NmbFloat } from '../LexicalAnalyzer/Symbols/NmbFloat';
import { NmbInt } from '../LexicalAnalyzer/Symbols/NmbInt';
import { OneSymbol } from '../LexicalAnalyzer/Symbols/OneSymbol';
import { StringConstant } from '../LexicalAnalyzer/Symbols/StringConstant';
import { Addition } from '../SyntaxAnalyzer/Tree/Addition';
import { Subtraction } from '../SyntaxAnalyzer/Tree/Subtraction';
import { Multiplication } from '../SyntaxAnalyzer/Tree/Multiplication';
import { Division } from '../SyntaxAnalyzer/Tree/Division';
import { IntegerDivision } from '../SyntaxAnalyzer/Tree/IntegerDivision';
import { Modulo } from '../SyntaxAnalyzer/Tree/Modulo';
import { LogicalAnd } from '../SyntaxAnalyzer/Tree/LogicalAnd';
import { LogicalOr } from '../SyntaxAnalyzer/Tree/LogicalOr';
import { UnaryMinus } from '../SyntaxAnalyzer/Tree/UnaryMinus';
import { CompoundOperator } from '../SyntaxAnalyzer/Tree/CompoundOperator';
import { Implication } from '../SyntaxAnalyzer/Tree/Implication';
import { ProcedureCall } from '../SyntaxAnalyzer/Tree/ProcedureCall';
import { In } from '../SyntaxAnalyzer/Tree/Relations/In';
import { Equal } from '../SyntaxAnalyzer/Tree/Relations/Equal';
import { NotEqual } from '../SyntaxAnalyzer/Tree/Relations/NotEqual';
import { Less } from '../SyntaxAnalyzer/Tree/Relations/Less';
import { Greater } from '../SyntaxAnalyzer/Tree/Relations/Greater';
import { GreaterOrEqual } from '../SyntaxAnalyzer/Tree/Relations/GreaterOrEqual';
import { LessOrEqual } from '../SyntaxAnalyzer/Tree/Relations/LessOrEqual';
import { ProceduresStore } from './ProceduresStore';


export class Engine
{
    constructor(tree)
    {
        this.tree = tree;
        this.trees = [this.tree];
        this.treesCounter = 0;
        this.scopes = [];
        this.currentScopeId = 0;
        this.scopes[this.currentScopeId] = new Scope();
        this.procedureStore = new ProceduresStore();
    }

    getCurrentScope()
    {
        return this.scopes[this.currentScopeId];
    }

    run()
    {
        this.setVariables();

        let self = this;
        if (this.tree.sentences) {
            this.tree.sentences.forEach(
                function(sentence)
                {
                    self.evaluateSentence(sentence);
                }
            );
        }

//        console.dir(this.scopes, { depth: null });
    }

    setVariables()
    {
        let currentScope = this.getCurrentScope();

        if (this.tree.vars) {
            this.tree.vars.forEach(function (variablesDeclaration) {
                if (variablesDeclaration instanceof VariablesDeclaration) {

                    let typeId = null;

                    let variablesType = variablesDeclaration.variablesType;
                    if (variablesType instanceof SimpleVariablesType) {
                        let symbolCode = variablesType.symbol.symbolCode;
                        switch (symbolCode) {
                            case SymbolsCodes.integerSy:
                                typeId = TypesIds.INTEGER;
                                break;
                            case SymbolsCodes.booleanSy:
                                typeId = TypesIds.BOOLEAN;
                                break;
                            case SymbolsCodes.realSy:
                                typeId = TypesIds.REAL;
                                break;
                        }
                    }

                    if (typeId !== null) {
                        variablesDeclaration.identifiers.forEach(
                            function(identifier)
                            {
                                if (identifier instanceof Identifier) {
                                    let name = identifier.symbol.value;
                                    currentScope.addVariable(name, typeId);

                                } else {
                                    throw 'Identifier must be here!';
                                }
                            }
                        );

                    }
                } else {
                    throw 'VariablesDeclaration object must be here!';
                }
            });
        }
    }

    evaluateSentence(sentence)
    {
        let currentScope = this.getCurrentScope();

        if (sentence instanceof Assignation) {
            let identifier = sentence.destination.symbol.stringValue;
            let sourceExpression = sentence.sourceExpression;
            let expressionResult = this.evaluateExpression(sourceExpression);
            let typeId = expressionResult.typeId;
            let value = expressionResult.value;

            currentScope.setValue(identifier, typeId, value);
        } else if (sentence instanceof CompoundOperator) {
            if (sentence.sentences) {
                let self = this;
                sentence.sentences.forEach(
                    function(elem)
                    {
                        self.evaluateSentence(elem);
                    }
                );
            }
        } else if (sentence instanceof Implication) {
            let condition = this.evaluateExpression(sentence.condition);

            if (condition.value === true) {
                this.evaluateSentence(sentence.left);
            } else {
                this.evaluateSentence(sentence.right);
            }
        } else if (sentence instanceof ProcedureCall) {

            let procedureName = sentence.identifier.symbol.value;

            let isDeclaredProcedure = this.tree.procedures.hasOwnProperty(procedureName);
            let procedure = isDeclaredProcedure ?
                this.tree.procedures[procedureName]:
                this.procedureStore.getProcedure(procedureName);

            if (procedure === null) {
                // error procedure ${procedureName} not found
            }

            let scope = new Scope();
            this.addParametersToScope(sentence.parameters, procedure.signature, scope);
            this.treesCounter++;
            this.tree = procedure;
            this.currentScopeId++;
            this.scopes[this.currentScopeId] = scope;

            this.run();

            if (!isDeclaredProcedure &&
                typeof procedure.innerRun === 'function' ) {
                procedure.innerRun(scope);
            }

            delete this.scopes[this.currentScopeId];

            this.currentScopeId--;
            this.treesCounter--;
            this.tree = this.trees[this.treesCounter];
        }
    }

    addParametersToScope(parameters, signature, scope)
    {
        let parametersValues = parameters.map(elem => this.evaluateExpression(elem));
        if (signature.length === 0) {
            scope.addVariable('parametersList', TypesIds.ARRAY);
            scope.setValue('parametersList', TypesIds.ARRAY, parametersValues);
        } else {
            let parametersCounter = 0;
            signature.forEach(function(appliedType) {
                let identifiers = appliedType.identifiers;
                identifiers.forEach(function(identifier) {
                    let variableName = identifier.symbol.value;
                    let typeId = appliedType.typeId;
                    let value = parametersValues[parametersCounter].value;
                    scope.addVariable(variableName, typeId);
                    scope.setValue(variableName, typeId, value);
                    parametersCounter++;
                });
            });
        }
    }

    evaluateExpression(expression)
    {
        if (expression instanceof Equal) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value === rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof Greater) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value > rightOperand.value;

            return new ScalarVariable(result, typeId)
        } else if (expression instanceof Less) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value < rightOperand.value;

            return new ScalarVariable(result, typeId)
        } else if (expression instanceof GreaterOrEqual) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value >= rightOperand.value;

            return new ScalarVariable(result, typeId)
        } else if (expression instanceof LessOrEqual) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value <= rightOperand.value;

            return new ScalarVariable(result, typeId)
        } else if (expression instanceof NotEqual) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value !== rightOperand.value;

            return new ScalarVariable(result, typeId)
        } else if (expression instanceof In) {
            let leftOperand = this.evaluateExpression(expression.left);
            let rightOperand = this.evaluateExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = false;

            return new ScalarVariable(result, typeId)
        } else {
            return this.evaluateSimpleExpression(expression);
        }
    }

    evaluateSimpleExpression(expression)
    {
        if (expression instanceof Addition ||
                expression instanceof Subtraction) {

            let leftOperand = this.evaluateSimpleExpression(expression.left);
            let rightOperand = this.evaluateSimpleExpression(expression.right);
            let typeId = leftOperand.typeId === TypesIds.REAL ||
                    rightOperand.typeId === TypesIds.REAL ? TypesIds.REAL : TypesIds.INTEGER;

            let result = null;
            if (expression instanceof Addition) {
                result = leftOperand.value + rightOperand.value;
            } else if (expression instanceof Subtraction) {
                result = leftOperand.value - rightOperand.value;
            }

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof LogicalOr) {
            let leftOperand = this.evaluateSimpleExpression(expression.left);
            let rightOperand = this.evaluateSimpleExpression(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value || rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else {
            return this.evaluateTerm(expression);
        }
    }

    evaluateTerm(expression)
    {
        if (expression instanceof UnaryMinus) {
            let term = this.evaluateTerm(expression.value);
            return new ScalarVariable(-term.value, term.typeId);
        } else if (expression instanceof Multiplication) {
            let leftOperand = this.evaluateMultiplier(expression.left);
            let rightOperand = this.evaluateMultiplier(expression.right);
            let typeId = leftOperand.typeId === TypesIds.REAL ||
                    rightOperand.typeId === TypesIds.REAL ? TypesIds.REAL : TypesIds.INTEGER;
            let result = leftOperand.value * rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof Division) {
            let leftOperand = this.evaluateMultiplier(expression.left);
            let rightOperand = this.evaluateMultiplier(expression.right);
            let typeId = TypesIds.REAL;
            let result = leftOperand.value / rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof IntegerDivision) {
            let leftOperand = this.evaluateMultiplier(expression.left);
            let rightOperand = this.evaluateMultiplier(expression.right);
            let typeId = TypesIds.INTEGER;
            let result = Math.trunc(leftOperand.value / rightOperand.value);

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof Modulo) {
            let leftOperand = this.evaluateMultiplier(expression.left);
            let rightOperand = this.evaluateMultiplier(expression.right);
            let typeId = TypesIds.INTEGER;
            let result = leftOperand.value % rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else if (expression instanceof LogicalAnd) {
            let leftOperand = this.evaluateMultiplier(expression.left);
            let rightOperand = this.evaluateMultiplier(expression.right);
            let typeId = TypesIds.BOOLEAN;
            let result = leftOperand.value && rightOperand.value;

            return new ScalarVariable(result, typeId);
        } else {
            return this.evaluateMultiplier(expression);
        }
    }

    evaluateMultiplier(expression)
    {
        if (expression instanceof Constant) {
            return new ScalarVariable(expression.symbol.value, this.getConstantTypeId(expression));
        } else if (expression instanceof Identifier) {
            let currentScope = this.getCurrentScope();
            let name = expression.symbol.value;
            let foundVariable = currentScope.getVariable(name);

            return new ScalarVariable(foundVariable.value, foundVariable.typeId);
        } else {
            return this.evaluateExpression(expression);
        }
    }

    getConstantTypeId(constant)
    {
        if (constant instanceof Constant) {
            let symbol = constant.symbol;
            if (symbol instanceof NmbFloat) {
                return TypesIds.REAL;
            } else if (symbol instanceof NmbInt) {
                return TypesIds.INTEGER;
            } else if (symbol instanceof OneSymbol) {
                return TypesIds.CHAR;
            } else if (symbol instanceof StringConstant) {
                return TypesIds.STRING;
            }
        }

        return null;
    }
};