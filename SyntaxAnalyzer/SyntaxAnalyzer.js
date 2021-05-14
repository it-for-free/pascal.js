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
const UnaryMinus = require('./Tree/UnaryMinus.js');
const Program = require('./Tree/Program.js');
const Procedure = require('./Tree/Procedure.js');
const Function = require('./Tree/Function.js');
const In = require('./Tree/Relations/In.js');
const Equal = require('./Tree/Relations/Equal.js');
const NotEqual = require('./Tree/Relations/NotEqual.js');
const Less = require('./Tree/Relations/Less.js');
const Greater = require('./Tree/Relations/Greater.js');
const GreaterOrEqual = require('./Tree/Relations/GreaterOrEqual.js');
const LessOrEqual = require('./Tree/Relations/LessOrEqual.js');
const FunctionTypeApplied = require('./Tree/ParametersList/FunctionTypeApplied.js');
const ProcedureTypeApplied = require('./Tree/ParametersList/ProcedureTypeApplied.js');
const SimpleTypeApplied = require('./Tree/ParametersList/SimpleTypeApplied.js');
const TypesIds = require('../Semantics/Variables/TypesIds.js');


module.exports = class SyntaxAnalyzer
{
    constructor(lexicalAnalyzer)
    {
        this.lexicalAnalyzer = lexicalAnalyzer;
        this.symbolsDescription = new SymbolsDescription();
        this.symbol = null;
        this.tree = null;
        this.trees = [];
        this.treesCounter = 0;
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
        this.tree = new Program(this.symbol);
        this.trees[this.treesCounter] = this.tree;

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

            do {
                this.tree.vars.push(this.scanVarDeclaration());
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
            this.symbol.symbolCode === SymbolsCodes.booleanSy ||
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
        while (this.symbol.symbolCode === SymbolsCodes.procedureSy ||
                this.symbol.symbolCode === SymbolsCodes.functionSy) {
            switch (this.symbol.symbolCode) {
                case SymbolsCodes.procedureSy:
                    this.scanProcedure();
                    break;
                case SymbolsCodes.functionSy:
                    this.scanFunction();
            }
        }
    }

    scanProcedure()
    {
        let procedureSymbol = this.symbol;
        this.accept(SymbolsCodes.procedureSy);

        this.treesCounter++;
        this.tree = new Procedure(procedureSymbol);
        this.trees[this.treesCounter] = this.tree;
        this.tree.name = new Identifier(this.symbol);
        let procedureName = this.tree.name.symbol.value;
        this.accept(SymbolsCodes.ident);
        this.tree.signature = this.scanParametersList();
        this.accept(SymbolsCodes.semicolon);


        this.scanBlock();
        this.accept(SymbolsCodes.semicolon);

        this.trees[this.treesCounter - 1].procedures[procedureName] = this.tree;
        this.treesCounter--;
        this.tree = this.trees[this.treesCounter];
    }

    scanFunction()
    {
        this.accept(SymbolsCodes.functionSy);

    }

    /** Синтаксическая диаграмма "список параметров" */
    scanParametersList()
    {
        let parametersList = [];

        if (this.symbol.symbolCode === SymbolsCodes.leftPar) {
            this.nextSym();
            if (this.symbol.symbolCode !== SymbolsCodes.rightPar) {

                do {

                    if (parametersList.length > 0 &&
                        this.symbol.symbolCode === SymbolsCodes.semicolon ) {

                        this.nextSym();
                    }

                    let parameters = null;
                    switch (this.symbol.symbolCode) {
                        case SymbolsCodes.varSy:
                            parameters = new SimpleTypeApplied(this.symbol, true);
                            this.nextSym();
                            break;
                        case SymbolsCodes.functionSy:
                            parameters = new FunctionTypeApplied(this.symbol);
                            this.nextSym();
                            break;
                        case SymbolsCodes.procedureSy:
                            parameters = new ProcedureTypeApplied(this.symbol);
                            this.nextSym();
                            break;
                        case SymbolsCodes.ident:
                            parameters = new SimpleTypeApplied(this.symbol);
                            break;
                    }

                    let identifiers = [];

                    do {
                        if (identifiers.length > 0 &&
                            this.symbol.symbolCode === SymbolsCodes.comma) {
                            this.nextSym();
                        }

                        identifiers.push(new Identifier(this.symbol));
                        this.accept(SymbolsCodes.ident);

                    } while (this.symbol.symbolCode === SymbolsCodes.comma)

                    parameters.identifiers = identifiers;

                    if (parameters instanceof FunctionTypeApplied ||
                        parameters instanceof ProcedureTypeApplied) {

                        parameters.signature = this.scanParametersList();
                        this.accept(SymbolsCodes.colon);
                        parameters.returnType = this.scanReturnType();
                    } else {

                        this.accept(SymbolsCodes.colon);

                        switch (this.symbol.symbolCode) {
                            case SymbolsCodes.charSy:
                                parameters.typeId = TypesIds.CHAR;
                                this.nextSym();
                                break;
                            case SymbolsCodes.integerSy:
                                parameters.typeId = TypesIds.INTEGER;
                                this.nextSym();
                                break;
                            case SymbolsCodes.stringSy:
                                parameters.typeId = TypesIds.STRING;
                                this.nextSym();
                                break;
                            case SymbolsCodes.realSy:
                                parameters.typeId = TypesIds.REAL;
                                this.nextSym();
                                break;
                            case SymbolsCodes.booleanSy:
                                parameters.typeId = TypesIds.BOOLEAN;
                                this.nextSym();
                                break;
                            case SymbolsCodes.ident:
                                parameters = new SimpleTypeApplied(this.symbol);
                                parameters.typeIdentifier = new Identifier(this.symbol);
                                this.nextSym();
                                break;
                        }
                    }



                    parametersList.push(parameters);

                } while (this.symbol.symbolCode === SymbolsCodes.semicolon)

                this.accept(SymbolsCodes.rightPar);
            }
        }

        return parametersList;
    }

    scanReturnType()
    {
        let returnType = null;

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.charSy:
            case SymbolsCodes.integerSy:
            case SymbolsCodes.stringSy:
            case SymbolsCodes.realSy:
            case SymbolsCodes.booleanSy:
                returnType = new SimpleTypeApplied(this.symbol)
                break;
            case SymbolsCodes.functionSy:
                returnType = new FunctionTypeApplied(this.symbol)
                break;
            case SymbolsCodes.procedureSy:
                returnType = new ProcedureTypeApplied(this.symbol)
                break;
            case SymbolsCodes.ident:
                returnType = new SimpleTypeApplied(this.symbol);
                returnType.typeIdentifier = new Identifier(this.symbol);
                break;
        }

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.charSy:
                returnType.typeId = TypesIds.CHAR;
                this.nextSym();
                break;
            case SymbolsCodes.integerSy:
                returnType.typeId = TypesIds.INTEGER;
                this.nextSym();
                break;
            case SymbolsCodes.stringSy:
                returnType.typeId = TypesIds.STRING;
                this.nextSym();
                break;
            case SymbolsCodes.realSy:
                returnType.typeId = TypesIds.REAL;
                this.nextSym();
                break;
            case SymbolsCodes.booleanSy:
                returnType.typeId = TypesIds.BOOLEAN;
                this.nextSym();
                break;
            case SymbolsCodes.functionSy:
                this.nextSym();
                returnType.signature = this.scanParametersList();
                this.accept(SymbolsCodes.colon);
                returnType.returnType = this.scanReturnType();
                break;
            case SymbolsCodes.procedureSy:
                this.nextSym();
                returnType.signature = this.scanParametersList(false);
                break;
        }

        return returnType;
    }

    statementPart()
    {
        this.accept(SymbolsCodes.beginSy);

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
                return new ProcedureCall(ident, new Identifier(ident), parameters);
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
                return new Identifier(ident);
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
                return new LessOrEqual(this.symbol, simpleExpression, this.scanSimpleExpression());
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
                this.nextSym();
                return new Multiplication(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.slash:
                this.nextSym();
                return new Division(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.divSy:
                this.nextSym();
                return new IntegerDivision(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.modSy:
                this.nextSym();
                return new Modulo(this.symbol, multiplier, this.scanMultiplier());
            case SymbolsCodes.andSy:
                this.nextSym();
                return new LogicalAnd(this.symbol, multiplier, this.scanMultiplier());
            default:
                return multiplier;
        }
    }

    /** Синтаксическая диаграмма "множитель" */
    scanMultiplier()
    {
        if (this.symbol.symbolCode === SymbolsCodes.ident) {
            let ident = this.symbol;
            this.nextSym();
            let variable = this.scanVariable(ident);
            // имя функции или переменной
            if (variable instanceof Identifier) {

                if (this.symbol.symbolCode === SymbolsCodes.leftPar) {
                    this.nextSym();
                    let parameters = this.scanParameters();

                    return new FunctionCall(variable.symbol, parameters);
                } else {
                    return variable;
                }
            }

        } else if ( this.symbol.symbolCode === SymbolsCodes.floatC ||
                    this.symbol.symbolCode === SymbolsCodes.intC ||
                    this.symbol.symbolCode === SymbolsCodes.stringC ||
                    this.symbol.symbolCode === SymbolsCodes.charC) {
            return this.scanUnsignedConstant();
        } else if (this.symbol.symbolCode === SymbolsCodes.leftPar) {
            this.nextSym();
            let embeddedExpression = this.scanExpression();
            this.accept(SymbolsCodes.rightPar);
            return embeddedExpression;
        }
    }

    scanParameters()
    {
        let parameters = [];
        if (this.symbol.symbolCode !== SymbolsCodes.rightPar) {
            do {

                if (parameters.length > 0 &&
                    this.symbol.symbolCode === SymbolsCodes.comma) {
                    this.nextSym();
                }

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
            case SymbolsCodes.stringC:
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
            case SymbolsCodes.stringC:
                constant = new Constant(this.symbol);
                this.nextSym();
        }

        if (unaryMinus) {
            constant = new UnaryMinus(signSymbol, constant);
        }

        return constant;
    }
};