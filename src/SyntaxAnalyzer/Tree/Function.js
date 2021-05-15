import { ProgramBase } from './ProgramBase';

export class Function extends ProgramBase
{
    constructor(symbol)
    {
        super(symbol);
        this.returnType = null;
        this.signature = [];
    }
}