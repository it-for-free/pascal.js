import { TreeNodeBase } from '../TreeNodeBase';

export class IndexedFunctionCall extends TreeNodeBase
{
    constructor(symbol, functionCall, indexRing)
    {
        super(symbol);
        this.functionCall = functionCall;
        this.indexRing = indexRing;
    }
}