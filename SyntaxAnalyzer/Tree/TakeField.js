const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class TakeField extends TreeNodeBase
{
    constructor(symbol, field, subField)
    {
        super(symbol);
        this.field = field;
        this.subField = subField;
    }
}

