const BinaryOperation = require('./BinaryOperation.js');

module.exports = class Multiplication extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}