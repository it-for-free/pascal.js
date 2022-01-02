import { TreeNodeBase } from './TreeNodeBase';

export class FunctionCall extends TreeNodeBase
{
    constructor(symbol, identifierBranch, parameters = [])
    {
        super(symbol);
        this.identifierBranch = identifierBranch;
        this.parameters = parameters;
    }
}