const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class VariablesDeclaration extends TreeNodeBase
{
    constructor(symbol, identifiers, variablesType)
    {
        super(symbol);
        this.identifiers = identifiers;
        this.variablesType = variablesType;
    }
}

