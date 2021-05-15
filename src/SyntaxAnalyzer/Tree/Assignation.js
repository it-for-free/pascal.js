import { TreeNodeBase } from './TreeNodeBase';

export class Assignation extends TreeNodeBase
{
    constructor(symbol, destination, sourceExpression)
    {
        super(symbol);
        this.destination = destination;
        this.sourceExpression = sourceExpression;
    }
}