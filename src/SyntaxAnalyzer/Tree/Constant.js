const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class Constant extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
    }
}