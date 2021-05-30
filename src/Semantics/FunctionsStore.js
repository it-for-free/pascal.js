import { ProcedureItem } from './ProcedureItem';
import { WriteLn } from './Procedures/WriteLn.js';

export class FunctionsStore
{
    constructor()
    {
        this.items = {
            writeln: new WriteLn()
        };
    }

    addFunction(name, procedure)
    {
        this.items[name.toLowerCase()] = procedure;
    }

    getFunction(name)
    {
        let lowerCaseName = name.toLowerCase();

        return this.items.hasOwnProperty(lowerCaseName) ?
            this.items[lowerCaseName] :
            null;
    }
};