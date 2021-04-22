const SymbolBase = require('./SymbolBase.js');

module.exports = class NmbInt extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super.constructor(textPosition, symbolCode, stringValue, Number.parseInt(stringValue));
    }
}