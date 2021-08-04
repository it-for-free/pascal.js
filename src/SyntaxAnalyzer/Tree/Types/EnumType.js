import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class EnumType extends TypeBase
{
    constructor(symbol)
    {
        super(symbol, TypesIds.ENUM);
        this.items = [];
    }
}
