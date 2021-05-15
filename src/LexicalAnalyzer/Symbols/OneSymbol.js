import { SymbolBase } from './SymbolBase';

export class OneSymbol extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, stringValue.replace(/'/g, ''));
    }
}