import { TreeNodeBase } from '../TreeNodeBase';

export class FunctionTypeApplied extends TreeNodeBase
{
    constructor(symbol, signature, identifiers)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.returnType = null;
        this.signature = signature;
    }
};