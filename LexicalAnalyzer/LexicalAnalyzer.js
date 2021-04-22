const SymbolsCodes = require('./SymbolsCodes.js');
const KeyWords = require('./KeyWords.js');
const Symbol = require('./Symbols/Symbol.js');
const NmbFloat = require('./Symbols/NmbFloat.js');
const NmbInt = require('./Symbols/NmbInt.js');

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
        this.keyWords = new KeyWords();
    }
    
    nextSym()
    {
        if (this.char === null) {
            return null;
        }

        this.skipWhiteSpaces();
        this.token = this.fileIO.getCurrentPosition();

        return this.scanSymbol();
    }

    scanSymbol()
    {
        this.currentWord = '';
        
        // <letter>
        if (/[a-z]/i.exec(this.char) !== null) {

            while (/\w/i.exec(this.char) !== null) {
                this.currentWord += this.char;
                this.char = this.fileIO.nextCh();
            }

            return this.getSymbol(this.keyWords.getSymbolCodeByKeyWord(this.currentWord));

        // <digit>
        } else if (/[\d.]/.exec(this.char) !== null) {
            
            this.currentWord += this.char;
            this.char = this.fileIO.nextCh();

            if (this.currentWord === '.' && this.char === '.') {

                this.currentWord += this.char;
                this.char = this.fileIO.nextCh();
                return this.getSymbol(SymbolsCodes.twoPoints);
                        
            } else if (this.currentWord === '.' && /\d/.exec(this.char) === null) {
                
                this.symbol = SymbolsCodes.point;
                return this.getSymbol(this.symbol);
            } else {
                var pointPresence = this.currentWord === '.';

                while (/[\d.]/.exec(this.char) !== null) {
                    if (this.char === '.') {
                        if (!pointPresence) {
                            pointPresence = true;
                        } else {
                            break;
                        }
                    }

                    this.currentWord += this.char;
                    this.char = this.fileIO.nextCh();
                }

                return pointPresence ?
                    new NmbFloat(this.token, SymbolsCodes.floatC, this.currentWord) :
                    new NmbInt(this.token, SymbolsCodes.intC, this.currentWord);
            }

        } else {
            switch (this.char) {
                case ':':
                    this.currentWord += this.char;
                    this.char = this.fileIO.nextCh();
                    if (this.char === '=') {
                        this.currentWord += this.char;
                        this.char = this.fileIO.nextCh();
                        return this.getSymbol(SymbolsCodes.assign);
                    } else {
                        return this.getSymbol(SymbolsCodes.colon);
                    }
                case '<':
                    this.currentWord += this.char;
                    this.char = this.fileIO.nextCh();
                    switch (this.char) {
                        case '=':
                            this.currentWord += this.char;
                            this.char = this.fileIO.nextCh();
                            return this.getSymbol(SymbolsCodes.laterEqual);
                        case '>':
                            this.currentWord += this.char;
                            this.char = this.fileIO.nextCh();
                            return this.getSymbol(SymbolsCodes.laterGreater);
                        default:
                            return this.getSymbol(SymbolsCodes.later);
                    }
                case '>':
                    this.currentWord += this.char;
                    this.char = this.fileIO.nextCh();
                    if (this.char === '=') {
                        this.currentWord += this.char;
                        this.char = this.fileIO.nextCh();
                        return this.getSymbol(SymbolsCodes.greaterEqual);
                    } else {
                        return this.getSymbol(SymbolsCodes.greater);
                    }

                case '*':
                    return this.getSymbol(SymbolsCodes.star);

                case '/':
                    return this.getSymbol(SymbolsCodes.slash);

                case '=':
                    return this.getSymbol(SymbolsCodes.equal);

                case ',':
                    return this.getSymbol(SymbolsCodes.comma);

                case ';':
                    return this.getSymbol(SymbolsCodes.semicolon);

                case '^':
                    return this.getSymbol(SymbolsCodes.arrow);

                case '(':
                    return this.getSymbol(SymbolsCodes.leftPar);

                case ')':
                    return this.getSymbol(SymbolsCodes.rightPar);

                case '[':
                    return this.getSymbol(SymbolsCodes.lBracket);

                case ']':
                    return this.getSymbol(SymbolsCodes.rBracket);

                case '{':
                    return this.getSymbol(SymbolsCodes.flPar);

                case '}':
                    return this.getSymbol(SymbolsCodes.frPar);

                case '<':
                    return this.getSymbol(SymbolsCodes.later);

                case '>':
                    return this.getSymbol(SymbolsCodes.greater);

            }
        }
    }

    getSymbol()
    {
        return this.getSymbol(SymbolsCodes.greater, this.currentWord);
    }

    skipWhiteSpaces()
    {
        var ws = /\s/;

        while (ws.exec(this.char) !== null) {
            this.char = this.fileIO.nextCh();
        }
    }
}