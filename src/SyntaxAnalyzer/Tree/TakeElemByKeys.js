const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class TakeElemByKeys extends TreeNodeBase
{
    constructor(symbol, identifier, keys)
    {
        super(symbol);
        this.identifier = identifier;
        this.keys = keys;
    }
}

