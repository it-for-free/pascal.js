import { FunctionItem } from '../FunctionItem';
import { TypesIds } from '../../Semantics/Variables/TypesIds';
import { ScalarType } from '../../SyntaxAnalyzer/Tree/Types/ScalarType'

export class Ord extends FunctionItem
{
    constructor()
    {
        super();
        this.returnType = new ScalarType(null, TypesIds.INTEGER);
    }

    innerRun(scope)
    {
        let parametersList = scope.getParametersList();
        let charParameter = parametersList[0];
        let char = charParameter.value;
        let code = char.charCodeAt(0);

        scope.setValue('Ord', TypesIds.INTEGER, code);
    }
};