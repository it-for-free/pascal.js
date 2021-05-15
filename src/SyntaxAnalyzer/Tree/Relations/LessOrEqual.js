const BinaryOperation = require('../BinaryOperation.js');

module.exports = class LessOrEqual extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}