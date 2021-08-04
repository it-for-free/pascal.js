import { TreeNodeBase } from '../TreeNodeBase';

export class TypeApplied extends TreeNodeBase
{
    constructor(symbol, byReference = false, type = null, identifiers = [])
    {
        super(symbol);
        this.type = type;
        this.identifiers = identifiers;
        this.byReference = byReference;
    }
};