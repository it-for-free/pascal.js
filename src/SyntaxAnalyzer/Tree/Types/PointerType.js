import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class PointerType extends TypeBase
{
    constructor(symbol, mainType)
    {
        super(symbol, TypesIds.POINTER);
        this.mainType = mainType;
    }
}
