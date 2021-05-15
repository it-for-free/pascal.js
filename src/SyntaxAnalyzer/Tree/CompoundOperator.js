const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class CompoundOperator extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
        this.sentences = [];
    }
}