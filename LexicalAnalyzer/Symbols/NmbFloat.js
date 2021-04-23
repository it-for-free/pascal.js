const SymbolBase = require('./SymbolBase.js');

module.exports = class NmbFloat extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, parseFloat(stringValue));
    }
}