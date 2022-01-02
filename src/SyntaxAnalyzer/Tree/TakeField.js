import { TreeNodeBase } from './TreeNodeBase';

export class TakeField extends TreeNodeBase
{
    constructor(symbol, baseExpression, subField)
    {
        super(symbol);
        this.baseExpression = baseExpression;
        this.subField = subField;
    }
}