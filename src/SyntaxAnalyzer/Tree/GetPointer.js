import { TreeNodeBase } from './TreeNodeBase';

export class GetPointer extends TreeNodeBase
{
    constructor(symbol, identifier)
    {
        super(symbol);
        this.identifier = identifier;
    }
}