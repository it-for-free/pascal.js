import { TreeNodeBase } from './TreeNodeBase';

export class SimpleVariablesType extends TreeNodeBase
{
    constructor(symbol, isPointer = false)
    {
        super(symbol);
        this.isPointer = isPointer;
    }
}

