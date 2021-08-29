import { TreeNodeBase } from './TreeNodeBase';

export class Not extends TreeNodeBase
{
    constructor(symbol, value)
    {
        super(symbol);
        this.value = value;
    }
}