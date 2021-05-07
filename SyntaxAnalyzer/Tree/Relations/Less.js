const BinaryOperation = require('../BinaryOperation.js');

module.exports = class Less extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right)
    }
}