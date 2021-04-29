const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class UnaryMinus extends TreeNodeBase
{
    constructor(symbol, value)
    {
        super(symbol);
        this.value = value;
    }
}