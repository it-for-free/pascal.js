const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class BinaryOperation extends TreeNodeBase
{
    constructor(symbol, left, right)
    {
        this.symbol = symbol;
        this.left = left;
        this.right = right;
    }
}