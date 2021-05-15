import { TreeNodeBase } from '../TreeNodeBase';

export class SimpleTypeApplied extends TreeNodeBase
{
    constructor(symbol, byReference = false, typeId = null, identifiers = [])
    {
        super(symbol);
        this.typeId = typeId;
        this.identifiers = identifiers;
        this.byReference = byReference;
        this.typeIdentifier = null;
    }
};