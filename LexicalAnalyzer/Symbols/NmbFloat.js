const SymbolBase = require('./SymbolBase.js');

module.exports = class NmbFloat extends SymbolBase
{
    constructor(textPosition, symbolCode, value)
    {
        super.constructor(textPosition, symbolCode)
        this.value = value;
    }
}