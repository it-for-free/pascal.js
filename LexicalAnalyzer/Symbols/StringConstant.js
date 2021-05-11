const SymbolBase = require('./SymbolBase.js');

module.exports = class StringConstant extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, stringValue.replace(/'/g, ''));
    }
};