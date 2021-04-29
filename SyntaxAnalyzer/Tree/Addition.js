const BinaryOperation = require('./BinaryOperation.js');

module.exports = class Addition extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}