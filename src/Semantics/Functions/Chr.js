import { FunctionItem } from '../FunctionItem';
import { TypesIds } from '../../Semantics/Variables/TypesIds';
import { ScalarType } from '../../SyntaxAnalyzer/Tree/Types/ScalarType'

export class Chr extends FunctionItem
{
    constructor()
    {
        super();
        this.returnType = new ScalarType(null, TypesIds.CHAR);
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