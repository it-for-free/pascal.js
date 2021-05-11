const TreeNodeBase = require('../TreeNodeBase.js');

module.exports = class SimpleTypeApplied extends TreeNodeBase
{
    constructor(symbol, byReference = false, typeId = null, identifiers = [])
    {
        super(symbol);
        this.typeId = typeId;
        this.identifiers = identifiers;
        this.byReference = byReference;
        this.typeIdentifier = null;
    }
};