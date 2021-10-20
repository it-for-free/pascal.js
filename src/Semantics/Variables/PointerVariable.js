import { TypesIds } from './TypesIds';
import { BaseVariable } from './BaseVariable';
import { ArrayType } from '../../SyntaxAnalyzer/Tree/Types/ArrayType';
import { IndexRing } from '../../SyntaxAnalyzer/Tree/Arrays/IndexRing';
import { ErrorsCodes } from '../../Errors/ErrorsCodes';

export class PointerVariable extends BaseVariable
{
    constructor(variable, type)
    {
        super();
        this.typeId = TypesIds.POINTER;
        this.type = type;
        this.variable = variable;
    }
}