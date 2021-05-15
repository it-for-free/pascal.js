import { TreeNodeBase } from './TreeNodeBase';

export class TakeField extends TreeNodeBase
{
    constructor(symbol, field, subField)
    {
        super(symbol);
        this.field = field;
        this.subField = subField;
    }
}

