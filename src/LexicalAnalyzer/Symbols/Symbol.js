const SymbolBase = require('./SymbolBase.js');

module.exports = class Symbol extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, stringValue);
    }
}