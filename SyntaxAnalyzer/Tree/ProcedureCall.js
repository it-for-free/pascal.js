const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class ProcedureCall extends TreeNodeBase
{
    constructor(symbol, identifier, parameters = [])
    {
        super(symbol);
        this.identifier = identifier;
        this.parameters = parameters;
    }
}