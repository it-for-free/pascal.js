import { TreeNodeBase } from '../TreeNodeBase';

export class EnumType extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
        this.items = [];
    }
}
