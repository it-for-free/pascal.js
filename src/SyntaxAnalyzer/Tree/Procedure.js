import { ProgramBase } from './ProgramBase';

export class Procedure extends ProgramBase
{
    constructor(symbol)
    {
        super(symbol);
        this.signature = [];
    }
};