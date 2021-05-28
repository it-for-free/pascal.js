import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { SymbolsDescription } from '../LexicalAnalyzer/SymbolsDescription';
import { Assignation } from './Tree/Assignation';
import { TakeElemByKeys } from './Tree/TakeElemByKeys';
import { GetByPointer } from './Tree/GetByPointer';
import { TakeField } from './Tree/TakeField';
import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { Constant } from './Tree/Constant';
import { Identifier } from './Tree/Identifier';
import { FunctionCall } from './Tree/FunctionCall';
import { ProcedureCall } from './Tree/ProcedureCall';
import { SimpleVariablesType } from './Tree/Types/SimpleVariablesType';
import { VariablesDeclaration } from './Tree/VariablesDeclaration';
import { CompoundOperator } from './Tree/CompoundOperator';
import { Implication } from './Tree/Implication';
import { IntegerDivision } from './Tree/IntegerDivision';
import { Modulo } from './Tree/Modulo';
import { LogicalAnd } from './Tree/LogicalAnd';
import { LogicalOr } from './Tree/LogicalOr';
import { UnaryMinus } from './Tree/UnaryMinus';
import { Program } from './Tree/Program';
import { Procedure } from './Tree/Procedure';
import { Function } from './Tree/Function';
import { In } from './Tree/Relations/In';
import { Equal } from './Tree/Relations/Equal';
import { NotEqual } from './Tree/Relations/NotEqual';
import { Less } from './Tree/Relations/Less';
import { Greater } from './Tree/Relations/Greater';
import { GreaterOrEqual } from './Tree/Relations/GreaterOrEqual';
import { LessOrEqual } from './Tree/Relations/LessOrEqual';
import { FunctionTypeApplied } from './Tree/ParametersList/FunctionTypeApplied';
import { ProcedureTypeApplied } from './Tree/ParametersList/ProcedureTypeApplied';
import { SimpleTypeApplied } from './Tree/ParametersList/SimpleTypeApplied';
import { TypesIds } from '../Semantics/Variables/TypesIds';
import { TypesStore } from './TypesStore';
import { EnumType } from './Tree/Types/EnumType';
import { WhileCycle } from './Tree/Loops/WhileCycle';
import { RepeatCycle } from './Tree/Loops/RepeatCycle';
import { ForCycle } from './Tree/Loops/ForCycle';
import { NmbInt } from './../LexicalAnalyzer/Symbols/NmbInt';


export class SyntaxAnalyzer
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
            this.tree.name = this.symbol.stringValue;
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
        if (this.symbol.symbolCode === SymbolsCodes.typeSy) {
            this.tree.types = new TypesStore();
            this.nextSym();
            do {
                let identSymbol = this.symbol;
                this.accept(SymbolsCodes.ident);
                this.accept(SymbolsCodes.equal);
                let type = this.scanType();
                this.tree.types.addType(identSymbol.stringValue, type);
                this.accept(SymbolsCodes.semicolon);
            } while (this.symbol.symbolCode === SymbolsCodes.ident)
        }
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
        } else if (this.symbol.symbolCode === SymbolsCodes.leftPar) {
            let enumType = new EnumType(this.symbol);
            let ident = null;
            do {
                this.nextSym();
                ident = new Identifier(this.symbol);
                enumType.items.push(ident);
                this.accept(SymbolsCodes.ident);
            } while (this.symbol.symbolCode === SymbolsCodes.comma )
            this.accept(SymbolsCodes.rightPar);
            return enumType;
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
        } else if (this.symbol.symbolCode === SymbolsCodes.whileSy) {
            let whileSymbol = this.symbol;
            this.nextSym();
            let condition = this.scanExpression();
            this.accept(SymbolsCodes.doSy);
            let body = this.scanSentence();

            return new WhileCycle(whileSymbol, condition, body);
        } else if (this.symbol.symbolCode === SymbolsCodes.repeatSy) {
            let repeatSymbol = this.symbol;
            this.nextSym();
            let body = this.scanSentence();
            this.accept(SymbolsCodes.untilSy);
            let condition = this.scanExpression();

            return new RepeatCycle(repeatSymbol, condition, body);
        } else if (this.symbol.symbolCode === SymbolsCodes.forSy) {
            let forSymbol = this.symbol;
            this.nextSym();
            let identSymbol = this.symbol;
            this.accept(SymbolsCodes.ident);
            let variable = new Identifier(identSymbol);
            let assignSymbol = this.symbol;
            this.accept(SymbolsCodes.assign);

            let init = new Assignation(assignSymbol, variable, this.scanSimpleExpression());
            let countDown = false;
            let countSymbol = this.symbol;
            switch (this.symbol.symbolCode) {
                case SymbolsCodes.downtoSy:
                    countDown = true;
                    break;
                case SymbolsCodes.toSy:
                    countDown = false;
                    break;
                default:
                    let errorText = `Symbols 'to' or 'downto' expected but '${this.symbol.stringValue}' found.`;
                    this.addError(ErrorsCodes.inadmissibleSymbol, errorText, this.symbol);
            }

            this.nextSym();

            let condition = countDown ?
                new GreaterOrEqual(this.symbol, variable, this.scanSimpleExpression()) :
                new LessOrEqual(this.symbol, variable, this.scanSimpleExpression());

            this.accept(SymbolsCodes.doSy);
            let body = this.scanSentence();

            let unityConstant = new Constant(new NmbInt(countSymbol.textPosition, SymbolsCodes.intC, '1'));
            let operation = new Assignation(
                assignSymbol,
                variable,
                countDown ?
                new Subtraction(countSymbol, variable, unityConstant) :
                new Addition(countSymbol, variable, unityConstant)
            );

            return new ForCycle(forSymbol, init, condition, operation, body);
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
        let symbolCode = null;

        while ([SymbolsCodes.star,
                SymbolsCodes.slash,
                SymbolsCodes.divSy,
                SymbolsCodes.modSy,
                SymbolsCodes.andSy].includes(this.symbol.symbolCode)) {

            symbolCode = this.symbol.symbolCode;

            this.nextSym();

            switch (symbolCode) {
                case SymbolsCodes.star:
                    multiplier = new Multiplication(this.symbol, multiplier, this.scanMultiplier());
                    break;
                case SymbolsCodes.slash:
                    multiplier = new Division(this.symbol, multiplier, this.scanMultiplier());
                    break;
                case SymbolsCodes.divSy:
                    multiplier = new IntegerDivision(this.symbol, multiplier, this.scanMultiplier());
                    break;
                case SymbolsCodes.modSy:
                    multiplier = new Modulo(this.symbol, multiplier, this.scanMultiplier());
                    break;
                case SymbolsCodes.andSy:
                    multiplier = new LogicalAnd(this.symbol, multiplier, this.scanMultiplier());
            }
        }

        return multiplier;
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

    addError(errorCode, errorText = null, symbol)
    {
        this.lexicalAnalyzer.fileIO.addError(errorCode, errorText, symbol.textPosition);
    }
};