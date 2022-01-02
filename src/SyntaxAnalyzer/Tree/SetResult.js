import { TreeNodeBase } from './TreeNodeBase';

export class SetResult extends TreeNodeBase
{
    constructor(symbol, expression)
    {
        super(symbol);
        this.expression = expression;
    }
}