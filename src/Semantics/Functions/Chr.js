import { FunctionItem } from '../FunctionItem';
import { TypesIds } from '../../Semantics/Variables/TypesIds';

export class Chr extends FunctionItem
{
    constructor()
    {
        super();
        this.returnType = {typeId: TypesIds.CHAR};
    }

    innerRun(scope)
    {
        let parametersList = scope.getParametersList();
        let codeParameter = parametersList[0];
        let code = codeParameter.value;
        let char = String.fromCharCode(code);

        scope.setValue('Chr', TypesIds.CHAR, char);
    }
};