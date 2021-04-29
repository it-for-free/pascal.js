const TreeNodeBase = require('./BinaryOperation.js');

module.exports = class LogicalOr extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}