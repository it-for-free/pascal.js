import { TreeNodeBase } from '../TreeNodeBase';

export class IndexedIdentifier extends TreeNodeBase
{
    constructor(symbol, identifier, indexRing)
    {
        super(symbol);
        this.identifier = identifier;
        this.indexRing = indexRing;
    }
}