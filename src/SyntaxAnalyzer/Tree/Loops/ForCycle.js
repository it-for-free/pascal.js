import { TreeNodeBase } from '../TreeNodeBase';

export class ForCycle extends TreeNodeBase
{
    constructor(symbol, init, condition, operation, body)
    {
        super(symbol);
        this.init = init;
        this.condition = condition;
        this.operation = operation;
        this.body = body;
    }
}