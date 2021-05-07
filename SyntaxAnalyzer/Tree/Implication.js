const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class Implication extends TreeNodeBase
{
    constructor(symbol, condition, left, right)
    {
        super(symbol);
        this.condition = condition;
        this.left = left;
        this.right = right;
    }
}