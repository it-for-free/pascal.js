const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class Nil extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
    }
}