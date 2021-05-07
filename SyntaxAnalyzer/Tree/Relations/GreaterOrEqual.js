const BinaryOperation = require('../BinaryOperation.js');

module.exports = class GreaterOrEqual extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}