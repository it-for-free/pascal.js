import { SymbolBase } from './SymbolBase';

export class NmbFloat extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, parseFloat(stringValue));
    }
}