import { ProgramBase } from './ProgramBase';

export class Procedure extends ProgramBase
{
    constructor(symbol, type = null)
    {
        super(symbol);
        this.type = type;
    }
};