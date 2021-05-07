const BinaryOperation = require('../BinaryOperation.js');

module.exports = class Greater extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}