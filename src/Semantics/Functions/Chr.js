import { FunctionItem } from '../FunctionItem';

export class Chr extends FunctionItem
{
    constructor()
    {
        super();
    }

    innerRun(scope)
    {
        let parametersList = scope.getVariable('parametersList');
    }
};