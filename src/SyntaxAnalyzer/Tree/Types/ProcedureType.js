import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class ProcedureType extends TypeBase
{
    constructor(symbol, signature, identifiers)
    {
        super(symbol, TypesIds.PROCEDURE);
        this.identifiers = identifiers;
        this.signature = signature;
    }
};