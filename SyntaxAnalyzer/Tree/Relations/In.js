const BinaryOperation = require('../BinaryOperation.js');

module.exports = class In extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}