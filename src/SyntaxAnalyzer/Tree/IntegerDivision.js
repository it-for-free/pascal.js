const BinaryOperation = require('./BinaryOperation.js');

module.exports = class IntegerDivision extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}