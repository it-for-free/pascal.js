const SymbolBase = require('./SymbolBase.js');

module.exports = class Symbol extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super.constructor(textPosition, symbolCode, stringValue, stringValue);
    }
}