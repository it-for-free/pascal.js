const ErrorsCodes = require('../Errors/ErrorsCodes.js');
const SymbolsCodes = require('../LexicalAnalyzer/SymbolsCodes.js');
const SymbolsDescription = require('../LexicalAnalyzer/SymbolsDescription.js');
const Assignation = require('./Tree/Assignation.js');
const TakeElemByKeys = require('./Tree/TakeElemByKeys.js');
const GetByPointer = require('./Tree/GetByPointer.js');
const TakeField = require('./Tree/TakeField.js');
const Multiplication = require('./Tree/Multiplication.js');
const Division = require('./Tree/Division.js');
const Addition = require('./Tree/Addition.js');
const Subtraction = require('./Tree/Subtraction.js');
const Constant = require('./Tree/Constant.js');
const Identifier = require('./Tree/Identifier.js');
const FunctionCall = require('./Tree/FunctionCall.js');
const ProcedureCall = require('./Tree/ProcedureCall.js');
const SimpleVariablesType = require('./Tree/SimpleVariablesType.js');
const VariablesDeclaration = require('./Tree/VariablesDeclaration.js');
const CompoundOperator = require('./Tree/CompoundOperator.js');
const Implication = require('./Tree/Implication.js');
const IntegerDivision = require('./Tree/IntegerDivision.js');
const Modulo = require('./Tree/Modulo.js');
const LogicalAnd = require('./Tree/LogicalAnd.js');
const LogicalOr = require('./Tree/LogicalOr.js');
const In = require('./Tree/Relations/In.js');
const Equal = require('./Tree/Relations/Equal.js');
const NotEqual = require('./Tree/Relations/NotEqual.js');
const Less = require('./Tree/Relations/Less.js');
const Greater = require('./Tree/Relations/Greater.js');
const GreaterOrEqual = require('./Tree/Relations/GreaterOrEqual.js');
const LessOrEqual = require('./Tree/Relations/LessOrEqual.js');


module.exports = class SyntaxAnalyzer
{
    constructor(lexicalAnalyzer)
    {
        this.lexicalAnalyzer = lexicalAnalyzer;
        this.symbolsDescription = new SymbolsDescription();
        this.symbol = null;
        this.tree = null;
        this.errorDetected = false;
    }

    nextSym()
    {
        this.symbol = this.lexicalAnalyzer.nextSym();
    }

    anotherSymbolExpected(expectedSymbol)
    {
        let description = this.symbolsDescription.getSymbolTextByCode(expectedSymbol);
        let errorText = `'${description}' expected but '${this.symbol.stringValue}' found.`;
        this.lexicalAnalyzer.fileIO.addError(ErrorsCodes.inadmissibleSymbol, errorText, this.symbol.textPosition);
    }

    accept(expectedSymbolCode)
    {
        if (this.symbol === null) {
            return null;
        }

        if (this.symbol.symbolCode === expectedSymbolCode) {
            this.nextSym();
        } else {
            this.errorDetected = true;
            this.anotherSymbolExpected(expectedSymbolCode);
            this.goToEnd();
        }
    }

    analyze()
    {
        this.tree = {};
        this.nextSym();
        this.scanProgramme();

        return this.tree;
    }

    scanProgramme()
    {
        if (this.symbol.symbolCode === SymbolsCodes.programSy) {
            this.nextSym();
            this.accept(SymbolsCodes.ident);
            this.accept(SymbolsCodes.semicolon);
        }
        this.scanBlock();
        this.accept(SymbolsCodes.point);
    }

    scanBlock()
    {
        this.labelPart();
        this.constPart();
        this.typePart();
        this.varPart();
        this.procFuncPart();
        this.statementPart();
    }

    labelPart()
    {

    }

    constPart()
    {

    }

    typePart()
    {

    }

    varPart()
    {
        if (this.symbol.symbolCode === SymbolsCodes.varSy) {
            this.nextSym();
            this.tree.var = [];

            do {
                this.tree.var.push(this.scanVarDeclaration());
                this.accept(SymbolsCodes.semicolon);
            } while (!this.errorDetected &&
                this.symbol.symbolCode === SymbolsCodes.ident)
        }
    }

    scanVarDeclaration()
    {
        let identifiers = [];
        let ident = null;
        let condition = false;

        do {
            ident = new Identifier(this.symbol);
            this.accept(SymbolsCodes.ident);
            identifiers.push(ident);

            condition = (this.symbol.symbolCode === SymbolsCodes.comma);
            if (condition) {
                this.nextSym();
            }

        } while (!this.errorDetected &&
                condition)

        let colon = this.symbol;
        this.accept(SymbolsCodes.colon);
        let type = this.scanType();

        return new VariablesDeclaration(colon, identifiers, type);
    }

    scanType()
    {
        let typeSymbol = null;
        if (this.symbol.symbolCode === SymbolsCodes.integerSy ||
            this.symbol.symbolCode === SymbolsCodes.realSy ||
            this.symbol.symbolCode === SymbolsCodes.charSy ||
            this.symbol.symbolCode === SymbolsCodes.ident) {

            typeSymbol = this.symbol;
            this.nextSym();

            return new SimpleVariablesType(typeSymbol, false)
            this.nextSym();
        } else {
            this.accept(SymbolsCodes.ident);
        }
    }

    procFuncPart()
    {

    }

    statementPart()
    {
        this.accept(SymbolsCodes.beginSy);

        this.tree.sentences = [];

        while ( this.symbol !== null &&
                this.symbol.symbolCode !== SymbolsCodes.endSy) {

            let sentence = this.scanSentence();
            this.tree.sentences.push(sentence);

            this.accept(SymbolsCodes.semicolon);
        }

        this.accept(SymbolsCodes.endSy);
    }

    goToEnd()
    {
        do {
            this.nextSym();
        } while (this.symbol !== null)
    }

    /** Синтаксическая диаграмма "оператор" */
    scanSentence()
    {
        // Имя переменной, функции или процедуры
        if (this.symbol.symbolCode === SymbolsCodes.ident) {
            let ident = this.symbol;
            this.nextSym();
            // Имя процедуры
            if (this.symbol.symbolCode === SymbolsCodes.leftPar) {
                this.nextSym();
                let parameters = this.scanParameters();
                return new ProcedureCall(ident, parameters);
            // Имя переменной или функции
            } else {
                let variable = this.scanVariable(ident);
                let assignSymbol = this.symbol;
                this.accept(SymbolsCodes.assign);
                return new Assignation(assignSymbol, variable, this.scanExpression());
            }
        } else if (this.symbol.symbolCode === SymbolsCodes.beginSy) {
            return this.scanCompoundOperator();
        } else if (this.symbol.symbolCode === SymbolsCodes.ifSy) {
            let ifSymbol = this.symbol;
            this.nextSym();
            let condition = this.scanExpression();

            this.accept(SymbolsCodes.thenSy);
            let left = this.scanSentence();
            let right = null;
            if (this.symbol.symbolCode === SymbolsCodes.elseSy) {
                this.nextSym();
                right = this.scanSentence();
            }

            return new Implication(ifSymbol, condition, left, right);
        }
    }

    scanCompoundOperator()
    {
        let compoundOperator = new CompoundOperator(this.symbol);
        this.accept(SymbolsCodes.beginSy);

        while ( this.symbol !== null &&
                this.symbol.symbolCode !== SymbolsCodes.endSy) {

            let sentence = this.scanSentence();
            compoundOperator.sentences.push(sentence);

            this.accept(SymbolsCodes.semicolon);
        }

        this.accept(SymbolsCodes.endSy);

        return compoundOperator;
    }

    /** Синтаксическая диаграмма "переменная" */
    scanVariable(ident)
    {
        switch(this.symbol.symbolCode) {
            case SymbolsCodes.lBracket:
                let lBracket = this.symbol;
                let keys = [];
                do {
                    this.nextSym();
                    keys.push(this.scanExpression());
                } while (this.symbol.symbolCode === SymbolsCodes.comma)
                this.accept(SymbolsCodes.rBracket);
                return new TakeElemByKeys(lBracket, ident, keys);

            case SymbolsCodes.point:
                let point = null;
                let field = ident;
                let subField = null;

                do {
                    point = this.symbol;
                    this.accept(SymbolsCodes.ident);
                    subField = this.symbol;
                    this.nextSym();
                    field = new TakeField(point, field, subField);

                } while (this.symbol.symbolCode === SymbolsCodes.point)
                return field;

            case SymbolsCodes.arrow:
                let arrow = this.symbol;
                this.nextSym();
                return new GetByPointer(arrow, ident);

            default:
                return new Identifier(ident)
        }
    }

    /** Синтаксическая диаграмма "выражение" */
    scanExpression()
    {
        let simpleExpression = this.scanSimpleExpression();

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.equal:
                this.nextSym();
                return new Equal(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.later:
                this.nextSym();
                return new Less(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.greater:
                this.nextSym();
                return new Greater(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.laterGreater:
                this.nextSym();
                return new NotEqual(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.laterEqual:
                this.nextSym();
                return new LogicalAnd(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.greaterEqual:
                this.nextSym();
                return new GreaterOrEqual(this.symbol, simpleExpression, this.scanSimpleExpression());
            case SymbolsCodes.inSy:
                this.nextSym();
                return new In(this.symbol, simpleExpression, this.scanSimpleExpression());
            default:
                return simpleExpression;
        }
    }

    /** Синтаксическая диаграмма "простое выражение" */
    scanSimpleExpression()
    {
        let unaryMinus = false;
        let term = null;

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.minus:
                unaryMinus = true;
                break;
            case SymbolsCodes.plus:
                this.nextSym();
        }

        term = this.scanTerm();
        if (unaryMinus) {
            term = new UnaryMinus(this.symbol, term);
        }

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.plus ||
                    this.symbol.symbolCode === SymbolsCodes.minus ||
                    this.symbol.symbolCode === SymbolsCodes.or
                )) {

            switch (this.symbol.symbolCode) {
                case SymbolsCodes.plus:
                    this.nextSym();
                    term = new Addition(this.symbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.minus:
                    this.nextSym();
                    term = new Subtraction(this.symbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.orSym:
                    this.nextSym();
                    term = new LogicalOr(this.symbol, term, this.scanTerm());
                    break;
            }
        }

        return term;
    }

    /** Синтаксическая диаграмма "слагаемое" */
    scanTerm()
    {
        let multiplier = this.scanMultiplier();

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.star:
                return new Multiplication(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.slash:
                return new Division(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.divSy:
                return new IntegerDivision(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.modSy:
                return new Modulo(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.andSy:
                return new LogicalAnd(this.symbol, multiplier, this.scanMultiplier());
            default:
                return multiplier;
        }
    }

    /** Синтаксическая диаграмма "множитель" */
    scanMultiplier()
    {
        if (this.symbol.symbolCode === SymbolsCodes.ident) {
            let variable = this.scanVariable();
            // имя функции
            if (variable instanceof Identifier &&
                this.symbol.symbolCode === SymbolsCodes.leftPar) {
                this.nextSym();
                let parameters = this.scanParameters();

                return new FunctionCall(variable.symbol, parameters);
            }

            switch (this.symbol.symbolCode) {

            }
        } else if ( this.symbol.symbolCode === SymbolsCodes.floatC ||
                    this.symbol.symbolCode === SymbolsCodes.intC ||
                    this.symbol.symbolCode === SymbolsCodes.charC) {
            return this.scanUnsignedConstant();
        }
    }

    scanParameters()
    {
        let parameters = [];
        if (this.symbol.symbolCode !== SymbolsCodes.rightPar) {
            do {
                parameters.push(this.scanExpression());

            } while (this.symbol.symbolCode === SymbolsCodes.comma)

            this.accept(SymbolsCodes.rightPar);
        }

        return parameters;
    }

    /** Синтаксическая диаграмма "константа без знака" */
    scanUnsignedConstant()
    {
        let constant = null;

        switch(this.symbol.symbolCode) {
            case SymbolsCodes.floatC:
            case SymbolsCodes.intC:
            case SymbolsCodes.charC:
                constant = new Constant(this.symbol);
                this.nextSym();
        }

        return constant;
    }

    /** Синтаксическая диаграмма "константа" */
    scanConstant()
    {
        let unaryMinus = false;
        let signSymbol = null;
        switch(this.symbol.symbolCode) {
            case SymbolsCodes.minus:
                this.nextSym();
                unaryMinus = true;
                signSymbol = this.symbol;
                break;
            case SymbolsCodes.plus:
                this.nextSym();
        }

        let constant = null;

        switch(this.symbol.symbolCode) {
            case SymbolsCodes.floatC:
            case SymbolsCodes.intC:
            case SymbolsCodes.charC:
                constant = new Constant(this.symbol);
                this.nextSym();
        }

        if (unaryMinus) {
            constant = new UnaryMinus(signSymbol, constant);
        }

        return constant;
    }
}