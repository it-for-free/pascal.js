const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class Assignation extends TreeNodeBase
{
    constructor(symbol, destination, sourceExpression)
    {
        super(symbol);
        this.destination = destination;
        this.sourceExpression = sourceExpression;
    }
}