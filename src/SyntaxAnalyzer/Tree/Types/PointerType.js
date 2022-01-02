import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class PointerType extends TypeBase
{
    constructor(symbol, type)
    {
        super(symbol, TypesIds.POINTER);
        this.type = type;
    }

    toString()
    {
        return `^${this.type}`;
    }
}