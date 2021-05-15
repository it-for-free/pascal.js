const BinaryOperation = require('./BinaryOperation.js');

module.exports = class LogicalAnd extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}