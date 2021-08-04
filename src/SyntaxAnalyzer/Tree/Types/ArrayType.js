import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class ArrayType extends TypeBase
{
    constructor(symbol, typeOfElements = null, indexFrom = null, indexTo = null)
    {
        super(symbol, TypesIds.ARRAY);
        this.typeOfElements = typeOfElements;
        this.indexFrom = indexFrom;
        this.indexTo = indexTo;
    }
}