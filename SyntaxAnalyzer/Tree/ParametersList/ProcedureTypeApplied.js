const TreeNodeBase = require('../TreeNodeBase.js');

module.exports = class ProcedureTypeApplied extends TreeNodeBase
{
    constructor(symbol, signature, identifiers)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.signature = signature;
    }
};