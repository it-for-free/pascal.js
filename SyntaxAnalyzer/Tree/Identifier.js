const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class Identifier extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
    }
}

