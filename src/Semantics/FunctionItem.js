import { ProcedureItem } from './ProcedureItem';

export class FunctionItem extends ProcedureItem
{
    constructor()
    {
        super();
        this.returnType = null;
    }
};