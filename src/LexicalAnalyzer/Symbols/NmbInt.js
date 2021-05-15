import { SymbolBase } from './SymbolBase';

export class NmbInt extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, Number.parseInt(stringValue));
    }
}