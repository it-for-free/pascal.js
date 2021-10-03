import { ProcedureItem } from './ProcedureItem';
import { WriteLn } from './Procedures/WriteLn';
import { ReadLn } from './Procedures/ReadLn';
import { Write } from './Procedures/Write';

export class ProceduresStore
{
    constructor(outputStream, ouputNewLineSymbol, inputNewLineSymbol, inputStream)
    {
        this.items = {
            writeln: new WriteLn(outputStream, ouputNewLineSymbol),
            write: new Write(outputStream),
            readln: new ReadLn(inputStream, inputNewLineSymbol),
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