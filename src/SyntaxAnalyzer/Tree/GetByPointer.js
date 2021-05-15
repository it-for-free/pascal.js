const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class GetByPointer extends TreeNodeBase
{
    constructor(symbol, pointer)
    {
        super(symbol);
        this.pointer = pointer;
    }
}

