const SymbolBase = require('./SymbolBase.js');

module.exports = class OneSymbol extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, stringValue);
    }
}