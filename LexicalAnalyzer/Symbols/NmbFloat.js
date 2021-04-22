const SymbolBase = require('./SymbolBase.js');

module.exports = class NmbFloat extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super.constructor(textPosition, symbolCode, stringValue, parseFloat(stringValue));
    }
}