import { TextPosition } from './TextPosition';
import { ErrorsDescription } from '../Errors/ErrorsDescription';
import { RuntimeError } from '../Errors/RuntimeError';
import fs from 'fs'

export class FileIO
{
    constructor(fileName, printer)
    {
        this.errorsDescription = new ErrorsDescription();

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
        if (this.endOfFile && this.positionNow.charNumber >= this.currentLine.length) {
            return null;
        } else {
            if (this.positionNow.charNumber === this.currentLine.length) {
//                this.printer.listLine(this.currentLine.join(''), this.positionNow.lineNumber);
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

    addError(errorCode, errorText = null, textPosition = null)
    {
        let message = this.errorsDescription.getErrorTextByCode(errorCode) +
                (errorText === null ? '' : ('. ' + errorText));
        let currentPosition = textPosition === null ? this.getCurrentPosition() : textPosition;
        throw new RuntimeError(errorCode, message, currentPosition);
    }

    printListing(error = null)
    {
        let lineNumber = error.textPosition.lineNumber;

        for (let i = 0; i <= lineNumber; i++) {
            this.printer.listLine(this.lines[i], i);
        }

        this.printer.listError(error);

        for (let i = lineNumber + 1; i <= this.lines.length - 1; i++) {
            this.printer.listLine(this.lines[i], i);
        }
    }
}