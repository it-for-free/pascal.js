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

        console.log(this.tree);
    }

    scanProgramme()
    {
        this.accept(SymbolsCodes.programSy);
        this.accept(SymbolsCodes.ident);
        this.accept(SymbolsCodes.semicolon);
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
            do {
                this.varDeclaration();
                this.accept(SymbolsCodes.semicolon);
            } while (!this.errorDetected &&
                this.symbol.symbolCode === SymbolsCodes.ident)


        }
    }

    varDeclaration()
    {
        this.accept(SymbolsCodes.ident);
        while (!this.errorDetected &&
                this.symbol.symbolCode === SymbolsCodes.comma) {
            this.nextSym();
            this.accept(SymbolsCodes.ident);
        }

        this.accept(SymbolsCodes.colon);
        this.type();
    }

    type()
    {
        if (this.symbol.symbolCode === SymbolsCodes.integerSy ||
            this.symbol.symbolCode === SymbolsCodes.realSy ||
            this.symbol.symbolCode === SymbolsCodes.charSy) {

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
        }
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
        return this.scanSimpleExpression();
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

        while ( this.symbol.symbolCode === SymbolsCodes.plus ||
                this.symbol.symbolCode === SymbolsCodes.minus ||
                this.symbol.symbolCode === SymbolsCodes.or) {

            switch (this.symbol.symbolCode) {
                case SymbolsCodes.plus:
                    term = new Addition(this.symbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.minus:
                    term = new Subtraction(this.symbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.orSym:
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
//            case SymbolsCodes.divSy:
//            case SymbolsCodes.modSy:
//            case SymbolsCodes.andSy:
//            case SymbolsCodes.orSy:

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
        }

        return this.scanConstant();
        return this.scanVariable();
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