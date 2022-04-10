import { TreeNodeBase } from '../TreeNodeBase';

export class Switch extends TreeNodeBase
{
    constructor(symbol, switchExpression = null, cases = [], elseSentence = null)
    {
        super(symbol);
        this.switchExpression = switchExpression;
        this.cases = cases;
        this.elseSentence = elseSentence;
    }
}