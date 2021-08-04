import { TreeNodeBase } from './TreeNodeBase';

export class TypeDeclaration extends TreeNodeBase
{
    constructor(symbol, identifier, type)
    {
        super(symbol);
        this.identifier = identifier;
        this.type = type;
    }
}

