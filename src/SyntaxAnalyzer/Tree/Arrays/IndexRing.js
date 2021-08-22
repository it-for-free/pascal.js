import { TreeNodeBase } from '../TreeNodeBase';

export class IndexRing extends TreeNodeBase
{
    constructor(symbol, indexExpression, indexRing = null)
    {
        super(symbol);
        this.indexExpression = indexExpression;
        this.indexRing = indexRing;
    }

    appendIndexRing(indexRing)
    {
        if (this.indexRing === null) {
            this.indexRing = indexRing;
        } else {
            this.indexRing.appendIndexRing(indexRing);
        }
    }
}