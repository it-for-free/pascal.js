const SymbolBase = require('./SymbolBase.js');

module.exports = class OneSymbol extends SymbolBase
{
    constructor(textPosition, symbolCode, value)
    {
        super.constructor(textPosition, symbolCode)
        this.value = value;
    }
}