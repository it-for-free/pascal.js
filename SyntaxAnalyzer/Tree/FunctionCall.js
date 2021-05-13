const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class FunctionCall extends TreeNodeBase
{
    constructor(symbol, identifier, parameters = [])
    {
        super(symbol);
        this.identifier = identifier;
        this.parameters = parameters;
    }
}