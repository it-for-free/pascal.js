import { ProgramBase } from './ProgramBase';

export class Function extends ProgramBase
{
    constructor(symbol, type = null)
    {
        super(symbol);
        this.type = type;
    }
}