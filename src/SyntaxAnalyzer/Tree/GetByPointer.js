import { TreeNodeBase } from './TreeNodeBase';

export class GetByPointer extends TreeNodeBase
{
    constructor(symbol, pointer)
    {
        super(symbol);
        this.pointer = pointer;
    }
}

