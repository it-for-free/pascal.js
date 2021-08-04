import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class AppliedNamedType extends TypeBase
{
    /**
     * Symbol must be an identifier
     */
    constructor(symbol)
    {
        super(symbol, TypesIds.APPLIED_NAMED);
    }
}