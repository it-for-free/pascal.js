const TextPosition = require('./TextPosition.js');
const Error = require('./Error.js');
const fs = require('fs');

module.exports = class FileIO
{
    constructor(fileName, printer)
    {
        this.positionNow = new TextPosition();
        this.printer = printer;
        this.currentLine;
        this.currentLineErrors = [];
        var data = fs.readFileSync(fileName, 'UTF-8');
        this.lines = data.split(/\r?\n/);
        this.linePointer = 0;
        this.currentLine;
        this.endOfFile = false;
       
        this.readNextLine();
    }

    getCurrentPosition()
    {
        return new TextPosition(
            this.positionNow.lineNumber,
            this.positionNow.charNumber
        );
    }

    nextCh()
    {
        if (this.endOfFile) {
            return null;
        } else {
            if (this.positionNow.charNumber === this.currentLine.length) {
                this.printer.listLine(this.currentLine.join(''), this.positionNow.lineNumber);
                if (this.currentLineErrors.length > 0) {
                    this.printer.listErrors(this.currentLineErrors);
                }
                this.readNextLine();
                this.currentLineErrors = [];
                this.positionNow.lineNumber++;
                this.positionNow.charNumber = 0;
            }
            
            return this.currentLine[this.positionNow.charNumber++];
        }
    }

    readNextLine()
    {
       var currentLine = this.lines[this.linePointer++];
       this.currentLine = currentLine.split('');
       this.currentLine.push('\n');
       this.endOfFile = this.linePointer === this.lines.length;
    }

    addError(errorCode)
    {
        this.currentLineErrors.push(new Error(errorCode, this.getCurrentPosition()));
    }
}