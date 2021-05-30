import { ErrorsCodes } from './ErrorsCodes';

export class ErrorsDescription
{
    constructor()
    {
        this.errorCodeMapper = new Map([
            [1, 'An error in primitive type'],
            [2, 'Name expected'],
            [ErrorsCodes.inadmissibleSymbol, 'Inadmissible Symbol'],
            [ErrorsCodes.forbiddenCharacter, 'Forbidden character'],
            [ErrorsCodes.nameNotDescribed, 'Name is not described'],
        ]);
    }

    getErrorTextByCode(errorCode)
    {
        return  this.errorCodeMapper.has(errorCode) ?
                this.errorCodeMapper.get(errorCode) :
                null;
    }
}