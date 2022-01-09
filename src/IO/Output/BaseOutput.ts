import {ListingOutput} from './types';
import {getNumberOfDigits} from '../helpers';

export abstract class BaseOutput
{
    errorsCounter: number = 0;


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
        var lineNumberDigits = getNumberOfDigits(lineNumber);
        var errorNumberDigits = getNumberOfDigits(errorNumber);
        var difference = lineNumberDigits - errorNumberDigits;
        
        var zeroesNumber = difference > 0 ? difference : 0;
        var gapsNumber = difference < 0 ? 2 + difference : 2; 
        var starsNumber = lineNumberDigits + 4;
        
        return  '**' + ( errorNumber < 10 ? '0' : '' ) + '0'.repeat(zeroesNumber) + errorNumber + '*'.repeat(gapsNumber) +
                ' '.repeat(error.textPosition.charNumber + 1) + '^ Error Code ' + error.errorCode + '\n' +
                '*'.repeat(starsNumber) + '  ' + error.errorText;
    }
    
    listError(error)
    {
        console.log(this.getErrorText(error, ++this.errorsCounter));
    }
}