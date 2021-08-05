import { TreeNodeBase } from './TreeNodeBase';

export class ConstantDeclaration extends TreeNodeBase
{
    constructor(symbol, identifier, value, type = null)
    {
        super(symbol);
        this.identifier = identifier;
        this.value = value;
        this.type = type;
    }
}