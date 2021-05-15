import { TreeNodeBase } from './TreeNodeBase';

export class CompoundOperator extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
        this.sentences = [];
    }
}