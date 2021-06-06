import { FunctionItem } from '../FunctionItem';
import { TypesIds } from '../../Semantics/Variables/TypesIds';

export class Ord extends FunctionItem
{
    constructor()
    {
        super();
        this.returnType = {typeId: TypesIds.INTEGER};
    }

    innerRun(scope)
    {
        let parametersList = scope.getVariable('parametersList');
        let charParameter = parametersList.value[0];
        let char = charParameter.value;
        let code = char.charCodeAt(0);

        scope.setValue('Ord', TypesIds.INTEGER, code);
    }
};