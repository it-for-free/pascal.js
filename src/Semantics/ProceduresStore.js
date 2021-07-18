import { ProcedureItem } from './ProcedureItem';
import { WriteLn } from './Procedures/WriteLn';
import { Write } from './Procedures/Write';

export class ProceduresStore
{
    constructor(outputStream, ouputNewLineSymbol)
    {
        this.items = {
            writeln: new WriteLn(outputStream, ouputNewLineSymbol),
            write: new Write(outputStream)
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