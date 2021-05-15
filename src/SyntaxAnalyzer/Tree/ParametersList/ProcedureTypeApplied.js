import { TreeNodeBase } from '../TreeNodeBase';

export class ProcedureTypeApplied extends TreeNodeBase
{
    constructor(symbol, signature, identifiers)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.signature = signature;
    }
};