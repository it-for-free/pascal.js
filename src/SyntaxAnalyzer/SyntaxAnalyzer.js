import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { SymbolsDescription } from '../LexicalAnalyzer/SymbolsDescription';
import { Assignation } from './Tree/Assignation';
import { TakeElemByKeys } from './Tree/TakeElemByKeys';
import { IndexedIdentifier } from './Tree/Arrays/IndexedIdentifier';
import { IndexRing } from './Tree/Arrays/IndexRing';
import { GetByPointer } from './Tree/GetByPointer';
import { GetPointer } from './Tree/GetPointer';
import { TakeField } from './Tree/TakeField';
import { SetResult } from './Tree/SetResult';
import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { Constant } from './Tree/Constant';
import { Identifier } from './Tree/Identifier';
import { FunctionCall } from './Tree/FunctionCall';
import { ProcedureCall } from './Tree/ProcedureCall';
import { ScalarType } from './Tree/Types/ScalarType';
import { RecordType } from './Tree/Types/RecordType';
import { AppliedNamedType } from './Tree/Types/AppliedNamedType';
import { VariablesDeclaration } from './Tree/VariablesDeclaration';
import { ConstantDeclaration } from './Tree/ConstantDeclaration';
import { TypeDeclaration } from './Tree/TypeDeclaration';
import { CompoundOperator } from './Tree/CompoundOperator';
import { Implication } from './Tree/Implication';
import { IntegerDivision } from './Tree/IntegerDivision';
import { Modulo } from './Tree/Modulo';
import { LogicalAnd } from './Tree/LogicalAnd';
import { LogicalOr } from './Tree/LogicalOr';
import { UnaryMinus } from './Tree/UnaryMinus';
import { Not } from './Tree/Not';
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
import { FunctionType } from './Tree/Types/FunctionType';
import { ProcedureType } from './Tree/Types/ProcedureType';
import { TypeApplied } from './Tree/ParametersList/TypeApplied';
import { TypesIds } from '../Semantics/Variables/TypesIds';
import { EnumType } from './Tree/Types/EnumType';
import { ArrayType } from './Tree/Types/ArrayType';
import { PointerType } from './Tree/Types/PointerType';
import { WhileCycle } from './Tree/Loops/WhileCycle';
import { RepeatCycle } from './Tree/Loops/RepeatCycle';
import { ForCycle } from './Tree/Loops/ForCycle';
import { NmbInt } from './../LexicalAnalyzer/Symbols/NmbInt';
import { Symbol } from './../LexicalAnalyzer/Symbols/Symbol';
import { Break } from './Tree/Break';


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
        if (this.symbol.symbolCode === SymbolsCodes.constSy) {
            this.tree.constants = [];
            this.nextSym();
            do {
                let identSymbol = this.symbol;
                this.accept(SymbolsCodes.ident);
                let type = null;
                if (this.symbol.symbolCode === SymbolsCodes.colon) {
                    this.nextSym();
                    type = this.scanType();
                }
                let equalSymbol = this.symbol;
                this.accept(SymbolsCodes.equal);

                let value = this.scanConstant();
                let constantDeclaration = new ConstantDeclaration(equalSymbol, new Identifier(identSymbol), value, type);
                this.tree.constants.push(constantDeclaration);
                this.accept(SymbolsCodes.semicolon);
            } while (this.symbol.symbolCode === SymbolsCodes.ident)
        }
    }

    typePart()
    {
        this.tree.types = [];
        if (this.symbol.symbolCode === SymbolsCodes.typeSy) {
            this.nextSym();
            do {
                let identSymbol = this.symbol;
                this.accept(SymbolsCodes.ident);
                let equalSymbol = this.symbol;
                this.accept(SymbolsCodes.equal);
                let type = this.scanType();
                let typeDeclaration = new TypeDeclaration(equalSymbol, new Identifier(identSymbol), type);
                this.tree.types.push(typeDeclaration);
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

    scanListArrayType(typeSymbol)
    {
        let elemsType = null;

        let leftIndex = this.scanConstant();
        this.accept(SymbolsCodes.twoPoints);
        let rightIndex = this.scanConstant();

        if (this.symbol.symbolCode === SymbolsCodes.comma) {
            typeSymbol = this.symbol;
            this.nextSym();
            elemsType = this.scanListArrayType();
        } else {
            this.accept(SymbolsCodes.rBracket);
            this.accept(SymbolsCodes.ofSy);
            elemsType = this.scanType();
        }

        return new ArrayType(typeSymbol, leftIndex, rightIndex, elemsType);
    }

    scanType()
    {
        let typeSymbol = null;
        if (this.symbol.symbolCode === SymbolsCodes.arrow) {
            typeSymbol = this.symbol;
            this.nextSym();
            let targetType = this.scanType();
            return new PointerType(typeSymbol, targetType);
        } else if (this.symbol.symbolCode === SymbolsCodes.integerSy ||
            this.symbol.symbolCode === SymbolsCodes.booleanSy ||
            this.symbol.symbolCode === SymbolsCodes.realSy ||
            this.symbol.symbolCode === SymbolsCodes.stringSy ||
            this.symbol.symbolCode === SymbolsCodes.charSy) {

            typeSymbol = this.symbol;
            this.nextSym();
            let typeId = null;

            switch (typeSymbol.symbolCode) {
                case SymbolsCodes.charSy:
                    typeId = TypesIds.CHAR;
                    break;
                case SymbolsCodes.integerSy:
                    typeId = TypesIds.INTEGER;
                    break;
                case SymbolsCodes.stringSy:
                    typeId = TypesIds.STRING;
                    break;
                case SymbolsCodes.realSy:
                    typeId = TypesIds.REAL;
                    break;
                case SymbolsCodes.booleanSy:
                    typeId = TypesIds.BOOLEAN;
                    break;
            }

            return new ScalarType(typeSymbol, typeId);
        } else if (this.symbol.symbolCode === SymbolsCodes.ident) {
            typeSymbol = this.symbol;
            this.nextSym();
            return new AppliedNamedType(typeSymbol);
        } else if (this.symbol.symbolCode === SymbolsCodes.arraySy) {
            typeSymbol = this.symbol;
            this.nextSym();
            this.accept(SymbolsCodes.lBracket);
            return this.scanListArrayType(typeSymbol);
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
        } else if (this.symbol.symbolCode === SymbolsCodes.functionSy) {
            let functionType = new FunctionType(this.symbol);
            this.nextSym();
            functionType.signature = this.scanParametersList();
            this.accept(SymbolsCodes.colon);
            functionType.returnType = this.scanType();
            return functionType;
        } else if (this.symbol.symbolCode === SymbolsCodes.procedureSy) {
            let procedureType = new ProcedureType(this.symbol);
            this.nextSym();
            procedureType.signature = this.scanParametersList();
            return procedureType;
        } else if (this.symbol.symbolCode === SymbolsCodes.recordSy) {
            let recordSymbol = this.symbol;
            this.nextSym();

            let recordElems = [];

            do {
                if (recordElems.length > 0) {
                    if (this.symbol.symbolCode === SymbolsCodes.semicolon ) {
                        this.nextSym();
                    }
                    if (this.symbol.symbolCode === SymbolsCodes.endSy) {
                        break;
                    }
                }

                let parameters = new TypeApplied(this.symbol);

                let identifiers = [];

                do {
                    if (identifiers.length > 0 &&
                        this.symbol.symbolCode === SymbolsCodes.comma) {
                        this.nextSym();
                    }

                    identifiers.push(new Identifier(this.symbol));
                    this.accept(SymbolsCodes.ident);

                } while (this.symbol.symbolCode === SymbolsCodes.comma)

                this.accept(SymbolsCodes.colon);
                parameters.identifiers = identifiers;
                parameters.type = this.scanType();

                recordElems.push(parameters);

            } while (this.symbol.symbolCode === SymbolsCodes.semicolon)

            this.accept(SymbolsCodes.endSy);

            return new RecordType(recordSymbol, recordElems);

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
        let identifier = new Identifier(this.symbol);
        this.accept(SymbolsCodes.ident);
        let procedureType = new ProcedureType(procedureSymbol);
        procedureType.signature = this.scanParametersList();

        this.treesCounter++;
        this.tree = new Procedure(procedureSymbol, procedureType);
        this.trees[this.treesCounter] = this.tree;
        this.tree.name = identifier;
        let procedureName = this.tree.name.symbol.value.toLowerCase();
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
        let functionSymbol = this.symbol;
        this.accept(SymbolsCodes.functionSy);
        let identifier = new Identifier(this.symbol);
        this.accept(SymbolsCodes.ident);
        let functionType = new FunctionType(functionSymbol);
        functionType.signature = this.scanParametersList();
        this.accept(SymbolsCodes.colon);
        functionType.returnType = this.scanType();

        this.treesCounter++;
        this.tree = new Function(functionSymbol, functionType);
        this.trees[this.treesCounter] = this.tree;
        this.tree.name = identifier;
        let functionName = this.tree.name.symbol.value.toLowerCase();
        this.accept(SymbolsCodes.semicolon);
        this.scanBlock();
        this.accept(SymbolsCodes.semicolon);

        this.trees[this.treesCounter - 1].functions[functionName] = this.tree;
        this.treesCounter--;
        this.tree = this.trees[this.treesCounter];

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

                    let byReference = false;
                    if (this.symbol.symbolCode === SymbolsCodes.varSy) {
                        byReference = true;
                        this.nextSym();
                    }

                    let parameters = new TypeApplied(this.symbol, byReference);

                    let identifiers = [];

                    do {
                        if (identifiers.length > 0 &&
                            this.symbol.symbolCode === SymbolsCodes.comma) {
                            this.nextSym();
                        }

                        identifiers.push(new Identifier(this.symbol));
                        this.accept(SymbolsCodes.ident);

                    } while (this.symbol.symbolCode === SymbolsCodes.comma)

                    this.accept(SymbolsCodes.colon);
                    parameters.identifiers = identifiers;
                    parameters.type = this.scanType();

                    parametersList.push(parameters);

                } while (this.symbol.symbolCode === SymbolsCodes.semicolon)
            }
            this.accept(SymbolsCodes.rightPar);
        }

        return parametersList;
    }

    statementPart()
    {
        this.accept(SymbolsCodes.beginSy);

        while ( this.symbol !== null &&
                this.symbol.symbolCode !== SymbolsCodes.endSy) {

            let sentence = this.scanSentence();
            this.tree.sentences.push(sentence);

            if (this.symbol.symbolCode !==  SymbolsCodes.endSy) {
                this.accept(SymbolsCodes.semicolon);
            }
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
        if (this.symbol.symbolCode === SymbolsCodes.ident) {
            let identifierBranch = this.scanIdentifierBranch();

            if (this.symbol.symbolCode === SymbolsCodes.assign) {
                let assignSymbol = this.symbol;
                this.nextSym();
                return new Assignation(assignSymbol, identifierBranch, this.scanExpression());
            } else {
                return identifierBranch;
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
            let compoundOperator = new CompoundOperator(repeatSymbol);
            this.nextSym();

            while ( this.symbol !== null &&
                    this.symbol.symbolCode !== SymbolsCodes.untilSy) {

                let sentence = this.scanSentence();
                compoundOperator.sentences.push(sentence);

                this.accept(SymbolsCodes.semicolon);
            }

            this.accept(SymbolsCodes.untilSy);

            let body = compoundOperator;
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
            let initExpression = this.scanSimpleExpression();

            let countDown = false;
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
            let lastExpression = this.scanSimpleExpression();
            this.accept(SymbolsCodes.doSy);
            let body = this.scanSentence();

            return new ForCycle(forSymbol, variable, initExpression, lastExpression, countDown, body);
        }  else if (this.symbol.symbolCode === SymbolsCodes.breakSy) {
             let breakSymbol = this.symbol;
             this.nextSym();
             return new Break(breakSymbol);
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

            if (this.symbol.symbolCode !== SymbolsCodes.endSy) {
                this.accept(SymbolsCodes.semicolon);
            }
        }

        this.accept(SymbolsCodes.endSy);

        return compoundOperator;
    }

    scanIndicesBrackets(indexSymbol)
    {
        this.accept(SymbolsCodes.lBracket);
        let rootIndexRing = new IndexRing(indexSymbol, this.scanExpression());

        while (this.symbol.symbolCode === SymbolsCodes.comma) {
            let commaSymbol = this.symbol;
            this.nextSym();
            let currentIndexRing =  new IndexRing(commaSymbol, this.scanExpression());
            rootIndexRing.appendIndexRing(currentIndexRing);
        }

        this.accept(SymbolsCodes.rBracket);

        return rootIndexRing;
    }

    scanIndices(indexSymbol)
    {
        let lBracket = this.symbol;
        let rootIndexRing = this.scanIndicesBrackets(this.symbol);

        while (this.symbol.symbolCode === SymbolsCodes.lBracket) {
            let lBracketSymbol = this.symbol;
            let currentIndexRing = this.scanIndicesBrackets(lBracketSymbol);
            rootIndexRing.appendIndexRing(currentIndexRing);
        }

        return rootIndexRing;
    }

    /** Синтаксическая диаграмма "переменная" */
    scanIdentifierBranch(inputExpression = null)
    {
        let baseExpression = null;
        if (inputExpression === null) {
            let ident = this.symbol;
            this.nextSym();
            baseExpression = new Identifier(ident);
        } else {
            baseExpression = inputExpression;
        }

        switch(this.symbol.symbolCode) {
            case SymbolsCodes.leftPar:
                    let leftParSymbol = this.symbol;
                    this.nextSym();
                    let parameters = this.scanParameters();
                    return this.scanIdentifierBranch(new FunctionCall(leftParSymbol, baseExpression, parameters));
            case SymbolsCodes.lBracket:
                let lBracket = this.symbol;
                return this.scanIdentifierBranch(new IndexedIdentifier(lBracket, baseExpression, this.scanIndices()));
            case SymbolsCodes.point:
                let point = this.symbol;
                this.nextSym();
                let subField = new Identifier(this.symbol);
                this.accept(SymbolsCodes.ident);

                return this.scanIdentifierBranch(new TakeField(point, baseExpression, subField));

            case SymbolsCodes.arrow:
                let arrow = this.symbol;
                this.nextSym();
                return this.scanIdentifierBranch(new GetByPointer(arrow, baseExpression));
            default:
                return baseExpression;
        }
    }

    /** Синтаксическая диаграмма "выражение" */
    scanExpression()
    {
        if (this.symbol.symbolCode === SymbolsCodes.at) {
            let atSymbol = this.symbol;
            this.nextSym();
            let identSymbol = this.symbol;
            this.accept(SymbolsCodes.ident);
            let identifier = new Identifier(identSymbol);
            let identifierBranch = this.scanIdentifierBranch(identifier);

            return new GetPointer(atSymbol, identifierBranch);
        }

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
        let not = false;
        let term = null;
        let unaryOperationSymbol = null;

        switch (this.symbol.symbolCode) {
            case SymbolsCodes.minus:
                unaryMinus = true;
            case SymbolsCodes.plus:
                unaryOperationSymbol = this.symbol;
                this.nextSym();
                break;
            case SymbolsCodes.notSy:
                not = true;
                unaryOperationSymbol = this.symbol;
                this.nextSym();
        }

        term = this.scanTerm();
        if (unaryMinus) {
            term = new UnaryMinus(unaryOperationSymbol, term);
        }
        if (not) {
            term = new Not(unaryOperationSymbol, term);
        }

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.plus ||
                    this.symbol.symbolCode === SymbolsCodes.minus ||
                    this.symbol.symbolCode === SymbolsCodes.orSy
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
                case SymbolsCodes.orSy:
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
            return this.scanIdentifierBranch();
        } else if ( this.symbol.symbolCode === SymbolsCodes.floatC ||
                    this.symbol.symbolCode === SymbolsCodes.intC ||
                    this.symbol.symbolCode === SymbolsCodes.stringC ||
                    this.symbol.symbolCode === SymbolsCodes.charC ||
                    this.symbol.symbolCode === SymbolsCodes.booleanC ) {
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

        }

        this.accept(SymbolsCodes.rightPar);

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
            case SymbolsCodes.booleanC:
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
                signSymbol = this.symbol;
                this.nextSym();
                unaryMinus = true;
                break;
            case SymbolsCodes.plus:
                signSymbol = this.symbol;
                this.nextSym();
        }

        let constant = null;

        switch(this.symbol.symbolCode) {
            case SymbolsCodes.floatC:
            case SymbolsCodes.intC:
            case SymbolsCodes.charC:
            case SymbolsCodes.stringC:
            case SymbolsCodes.booleanC:
            case SymbolsCodes.ident:
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