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
const UnaryMinus = require('../SyntaxAnalyzer/Tree/UnaryMinus.js');


module.exports = class Engine
{
    constructor(tree)
    {
        this.tree = tree;
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
        let currentScope = this.getCurrentScope();

        if (this.tree.var) {
            this.tree.var.forEach(function (variablesDeclaration) {
                if (variablesDeclaration instanceof VariablesDeclaration) {

                    let typeId = null;

                    let variablesType = variablesDeclaration.variablesType;
                    if (variablesType instanceof SimpleVariablesType) {
                        let symbolCode = variablesType.symbol.symbolCode;
                        switch (symbolCode) {
                            case SymbolsCodes.integerSy:
                                typeId = TypesIds.INTEGER;
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

//                console.dir(variablesDeclaration, { depth: null });

            });
        }

        let self = this;
        if (this.tree.sentences) {
            this.tree.sentences.forEach(
                function(sentence)
                {
                    self.evaluateSentence(sentence);
                }
            );
        }

        console.dir(currentScope, { depth: null });
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
        }
    }

    evaluateExpression(expression)
    {
        return this.evaluateSimpleExpression(expression);
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
        } else {
            return this.evaluateTerm(expression);
        }
    }

    evaluateTerm(expression)
    {
        if (expression instanceof UnaryMinus) {
            let term = this.evaluateTerm(expression.term);
            return new ScalarVariable(-term.value, term.typeId);
        } else if (expression instanceof Multiplication) {

        } else if (expression instanceof Division) {

        } else {
            return this.evaluateMultiplier(expression);
        }
    }

    evaluateMultiplier(expression)
    {
        if (expression instanceof Constant) {
            return new ScalarVariable(expression.symbol.value, this.getConstantTypeId(expression));
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
}