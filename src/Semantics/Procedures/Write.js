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
        let parametersList = scope.getParametersList();

        this.outputStream.write(parametersList.map(elem => elem.value).join(''));
    }
};