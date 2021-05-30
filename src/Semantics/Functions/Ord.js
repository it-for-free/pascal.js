import { FunctionItem } from '../FunctionItem';

export class Ord extends FunctionItem
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