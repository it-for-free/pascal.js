const ErrorsCodes = require('../Errors/ErrorsCodes.js');
const SymbolsCodes = require('../LexicalAnalyzer/SymbolsCodes.js');
const SymbolsDescription = require('../LexicalAnalyzer/SymbolsDescription.js');

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
        this.programme();
    }

    programme()
    {
        this.accept(SymbolsCodes.programSy);
        this.accept(SymbolsCodes.ident);
        this.accept(SymbolsCodes.semicolon);
        this.block();
        this.accept(SymbolsCodes.point);
    }

    block()
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
        this.accept(SymbolsCodes.endSy);
    }

    goToEnd()
    {
        do {
            this.nextSym()
        } while (this.symbol !== null)
    }
}