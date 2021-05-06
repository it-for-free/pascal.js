const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class SimpleVariablesType extends TreeNodeBase
{
    constructor(symbol, isPointer = false)
    {
        super(symbol);
        this.isPointer = isPointer;
    }
}

