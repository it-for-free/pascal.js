const SymbolsCodes = require('./SymbolsCodes.js');

module.exports = class LexicalAnalyzer
{
    constructor(fileIO)
    {
        this.fileIO = fileIO;

        this.token = null;
        this.currentWord = null;
        this.char = ' ';
        this.symbol = null;

        this.MAX_IDENT = 64;
        
//         process.stdout.write(SymbolsCodes.charSy);

    }
    
    nextSym()
    {
        if (this.char === null) {
            return null;
        }

        this.skipWhiteSpaces();
        this.token = this.fileIO.getCurrentPosition();


        this.scanSymbol();
    }
    
    scanSymbol()
    {
        this.currentWord = '';
        
        // <letter>
        if (/[a-z]/i.exec(this.char) !== null) {

            while ((/\w/i.exec(this.char) !== null))
            this.currentWord += this.char;
            this.char = this.fileIO.nextCh();
            
            this.symbol = SymbolsCodes.
        }
    }

    skipWhiteSpaces()
    {
        var ws = /\s/;

        while (ws.exec(this.char) !== null) {
            this.char = this.fileIO.nextCh();
        }
    }
}