import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class RecordType extends TypeBase
{
    constructor(symbol, type)
    {
        super(symbol, TypesIds.RECORD);
        this.type = type;
    }

    toString()
    {
        return `record`;
    }
}
