import { TreeNodeBase } from './TreeNodeBase';

export class UnaryMinus extends TreeNodeBase
{
    constructor(symbol, value)
    {
        super(symbol);
        this.value = value;
    }
}