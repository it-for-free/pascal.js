const BinaryOperation = require('./BinaryOperation.js');

module.exports = class Division extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}