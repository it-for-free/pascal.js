const BinaryOperation = require('../BinaryOperation.js');

module.exports = class NotEqual extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}