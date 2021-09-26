import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class ScalarType extends TypeBase
{
    constructor(symbol, typeId)
    {
        super(symbol, typeId);
    }

    toString()
    {
        switch (this.typeId) {
            case TypesIds.BOOLEAN:
                return 'boolean';
            case TypesIds.CHAR:
                return 'char';
            case TypesIds.INTEGER:
                return 'integer';
            case TypesIds.REAL:
                return 'real';
            case TypesIds.STRING:
                return 'string';
        }
    }
}