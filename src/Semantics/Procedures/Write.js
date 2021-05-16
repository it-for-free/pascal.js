import { ProcedureItem } from '../ProcedureItem';

export class Write extends ProcedureItem
{
    constructor()
    {
        super();
    }

    innerRun(scope)
    {
        let parametersList = scope.getVariable('parametersList');

        process.stdout.write(parametersList.value.map(elem => elem.value).join(' '));
    }
};