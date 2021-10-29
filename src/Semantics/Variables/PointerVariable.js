import { TypesIds } from './TypesIds';
import { BaseVariable } from './BaseVariable';
import { ArrayType } from '../../SyntaxAnalyzer/Tree/Types/ArrayType';
import { IndexRing } from '../../SyntaxAnalyzer/Tree/Arrays/IndexRing';
import { ErrorsCodes } from '../../Errors/ErrorsCodes';
import { PointerType } from '../../SyntaxAnalyzer/Tree/Types/PointerType';

export class PointerVariable extends BaseVariable
{
    constructor(variable, targetType)
    {
        super();
        this.typeId = TypesIds.POINTER;
        this.type = new PointerType(null, targetType);
        this.variable = variable;
    }
}