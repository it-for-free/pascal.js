import { ProcedureItem } from '../ProcedureItem';

export class Write extends ProcedureItem
{
    constructor(outputStream)
    {
        super();
        this.outputStream = outputStream;
    }

    innerRun(scope)
    {
        let parametersList = scope.getVariable('parametersList');

        this.outputStream.write(parametersList.value.map(elem => elem.value).join(''));
    }
};