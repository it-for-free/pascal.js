const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class BinaryOperation extends TreeNodeBase
{
    constructor(symbol, left, right)
    {
        super(symbol);
        this.left = left;
        this.right = right;
    }
}