const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class ProcedureCall extends TreeNodeBase
{
    constructor(symbol, parameters = [])
    {
        super(symbol);
        this.parameters = parameters;
    }
}