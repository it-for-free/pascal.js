import { ProcedureItem } from './ProcedureItem';
import { WriteLn } from './Procedures/WriteLn.js';

export class ProceduresStore
{
    constructor()
    {
        this.items = {
            writeln: new WriteLn()
        };
    }

    addProcedure(name, procedure)
    {
        this.items[name.toLowerCase()] = procedure;
    }

    getProcedure(name)
    {
        let lowerCaseName = name.toLowerCase();

        return this.items.hasOwnProperty(lowerCaseName) ?
            this.items[lowerCaseName] :
            null;
    }
};