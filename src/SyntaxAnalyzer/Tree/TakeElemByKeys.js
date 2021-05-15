import { TreeNodeBase } from './TreeNodeBase';

export class TakeElemByKeys extends TreeNodeBase
{
    constructor(symbol, identifier, keys)
    {
        super(symbol);
        this.identifier = identifier;
        this.keys = keys;
    }
}

