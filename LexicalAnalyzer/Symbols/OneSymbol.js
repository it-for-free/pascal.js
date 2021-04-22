const SymbolBase = require('./SymbolBase.js');

module.exports = class OneSymbol extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super.constructor(textPosition, symbolCode, stringValue, stringValue);
    }
}