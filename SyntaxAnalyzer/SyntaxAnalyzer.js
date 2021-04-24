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
    }

    nextSym()
    {
        this.symbol = this.lexicalAnalyzer.nextSym();
    }

    anotherSymbolExpected(expectedSymbol)
    {
        let description = this.symbolsDescription.getSymbolTextByCode(expectedSymbol);
        errorText = `. '${description}' expected but '${this.symbol.stringValue}' found.`;
        this.lexicalAnalyzer.fileIO.addError(ErrorsCodes.inadmissibleSymbol, errorText);
    }

    accept(expectedSymbol)
    {
        if (this.symbol === expectedSymbol) {
            this.nextSym();
        } else {
            this.anotherSymbolExpected(expectedSymbol);
        }
    }

    analyze()
    {
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

    }

    procFuncPart()
    {

    }

    statementPart()
    {

    }
}