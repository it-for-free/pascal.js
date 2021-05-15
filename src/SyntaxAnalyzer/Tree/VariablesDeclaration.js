import { TreeNodeBase } from './TreeNodeBase';

export class VariablesDeclaration extends TreeNodeBase
{
    constructor(symbol, identifiers, variablesType)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.variablesType = variablesType;
    }
}

