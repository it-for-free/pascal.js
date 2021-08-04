import { TreeNodeBase } from '../TreeNodeBase';

export class TypeBase extends TreeNodeBase
{
    constructor(symbol, typeId)
    {
        super(symbol);
        this.typeId = typeId;
    }
}
