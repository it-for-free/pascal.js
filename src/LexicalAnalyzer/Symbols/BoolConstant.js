import { SymbolBase } from './SymbolBase';

export class BoolConstant extends SymbolBase
{
    constructor(textPosition, symbolCode, stringValue)
    {
        super(textPosition, symbolCode, stringValue, stringValue.toLowerCase() === 'true');
    }
};