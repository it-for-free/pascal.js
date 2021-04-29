const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class FunctionCall extends TreeNodeBase
{
    constructor(symbol, parameters = [])
    {
        super(symbol);
        this.parameters = parameters;
    }
}