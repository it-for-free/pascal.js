import { TreeNodeBase } from './TreeNodeBase';

export class VariablesDeclaration extends TreeNodeBase
{
    constructor(symbol, identifiers, variablesType, initialValue)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.variablesType = variablesType;
        this.initialValue = initialValue;
    }
}

