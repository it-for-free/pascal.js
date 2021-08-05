import { ProcedureItem } from '../ProcedureItem';

export class WriteLn extends ProcedureItem
{
    constructor(outputStream, ouputNewLineSymbol)
    {
        super();
        this.outputStream = outputStream;
        this.ouputNewLineSymbol = ouputNewLineSymbol;
    }

    innerRun(scope)
    {
        let parametersList = scope.getParametersList();

        this.outputStream.write(parametersList.map(elem => elem.value).join('') + this.ouputNewLineSymbol);
    }
};