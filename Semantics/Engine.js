const Scope = require('./Scope.js');
const ScalarVariable = require('./Variables/ScalarVariable.js');
const TypesIds = require('./Variables/TypesIds.js');
const VariablesDeclaration = require('../SyntaxAnalyzer/Tree/VariablesDeclaration.js');
const SimpleVariablesType = require('../SyntaxAnalyzer/Tree/SimpleVariablesType.js');
const Identifier = require('../SyntaxAnalyzer/Tree/Identifier.js');
const Assignation = require('../SyntaxAnalyzer/Tree/Assignation.js');
const SymbolsCodes = require('../LexicalAnalyzer/SymbolsCodes.js');
const Constant = require('../SyntaxAnalyzer/Tree/Constant.js');
const NmbFloat = require('../LexicalAnalyzer/Symbols/NmbFloat.js');
const NmbInt = require('../LexicalAnalyzer/Symbols/NmbInt.js');
const OneSymbol = require('../LexicalAnalyzer/Symbols/OneSymbol.js');
const Addition = require('../SyntaxAnalyzer/Tree/Addition.js');
const Subtraction = require('../SyntaxAnalyzer/Tree/Subtraction.js');
const Multiplication = require('../SyntaxAnalyzer/Tree/Multiplication.js');
const Division = require('../SyntaxAnalyzer/Tree/Division.js');
const IntegerDivision = require('../SyntaxAnalyzer/Tree/IntegerDivision.js');
const Modulo = require('../SyntaxAnalyzer/Tree/Modulo.js');
const LogicalAnd = require('../SyntaxAnalyzer/Tree/LogicalAnd.js');
const LogicalOr = require('../SyntaxAnalyzer/Tree/LogicalOr.js');
const UnaryMinus = require('../SyntaxAnalyzer/Tree/UnaryMinus.js');
const CompoundOperator = require('../SyntaxAnalyzer/Tree/CompoundOperator.js');
const Implication = require('../SyntaxAnalyzer/Tree/Implication.js');
const ProcedureCall = require('../SyntaxAnalyzer/Tree/ProcedureCall.js');
const In = require('../SyntaxAnalyzer/Tree/Relations/In.js');
const Equal = require('../SyntaxAnalyzer/Tree/Relations/Equal.js');
const NotEqual = require('../SyntaxAnalyzer/Tree/Relations/NotEqual.js');
const Less = require('../SyntaxAnalyzer/Tree/Relations/Less.js');
const Greater = require('../SyntaxAnalyzer/Tree/Relations/Greater.js');
const GreaterOrEqual = require('../SyntaxAnalyzer/Tree/Relations/GreaterOrEqual.js');
const LessOrEqual = require('../SyntaxAnalyzer/Tree/Relations/LessOrEqual.js');


module.exports = class Engine
{
    constructor(tree)
    {
        this.tree = tree;
        this.trees = [this.tree];
        this.treesCounter = 0;
        this.scopes = [];
        this.currentScopeId = 0;
        this.scopes[this.currentScopeId] = new Scope();
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

        console.dir(this.scopes, { depth: null });
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
                                    currentScope.addVariable(name, typeId)

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
            this.treesCounter++;
            let procedureName = sentence.identifier.symbol.value;
            this.tree = this.tree.procedures[procedureName];
            this.currentScopeId++;
            this.scopes[this.currentScopeId] = new Scope();

            this.run();
            delete this.scopes[this.currentScopeId];

            this.currentScopeId--;
            this.treesCounter--;
            this.tree = this.trees[this.treesCounter];

//            this.trees[this.treesCounter] = this.tree;
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
            }
        }

        return null;
    }
};