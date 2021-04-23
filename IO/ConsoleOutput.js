const ErrorsDescription = require('../Errors/ErrorsDescription.js');

module.exports = class ConsoleOutput
{
    constructor(errorsDescription)
    {
        this.errorsDescription = errorsDescription;
        this.errorsCounter = 0;
    }

    listLine(line, number)
    {
        var output = this.getLinePrefix(number + 1) + line;
        console.log(output.replace(/[\n\r]/g, ''));
    }

    listErrors(errors)
    {
        errors.forEach(elem => this.listError(elem));
    }

    getLinePrefix(lineNumber)
    {
        return '  ' + ( lineNumber < 10 ? '0' : '' ) + lineNumber + '    ';
    }

    getErrorText(error, errorNumber)
    {
        var lineNumber = error.textPosition.lineNumber;
        var lineNumberDigits = this.getNumberOfDigits(lineNumber);
        var errorNumberDigits = this.getNumberOfDigits(errorNumber);
        var difference = lineNumberDigits - errorNumberDigits;
        
        var zeroesNumber = difference > 0 ? difference : 0;
        var gapsNumber = difference < 0 ? 2 + difference : 2; 
        var starsNumber = lineNumberDigits + 4;
        
        return  '**' + ( errorNumber < 10 ? '0' : '' ) + '0'.repeat(zeroesNumber) + errorNumber + '*'.repeat(gapsNumber) +
                ' '.repeat(error.textPosition.charNumber + 2) + '^ Error Code ' + error.errorCode + '\n' +
                '*'.repeat(starsNumber) + '  ' + this.errorsDescription.getErrorTextByCode(error.errorCode);
    }

    listError(error)
    {
        console.log(this.getErrorText(error, ++this.errorsCounter));
    }

    getNumberOfDigits(number)
    {
        return (number < 10 ? 1 : Math.floor(Math.log10(number))) + 1;
    }
}