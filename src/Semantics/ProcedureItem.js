import { ProgramBase } from '../SyntaxAnalyzer/Tree/ProgramBase';

export class ProcedureItem extends ProgramBase
{
    constructor()
    {
        super();
        this.vars = [];
        this.signature = [];
        this.sentences = [];
        this.name = null;
    }

    innerRun()
    {
    }
};