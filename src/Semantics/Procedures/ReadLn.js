import { ProcedureItem } from '../ProcedureItem';
import readlineSync from 'readline-sync';
import { ScalarVariable } from '../Variables/ScalarVariable';

export class ReadLn extends ProcedureItem
{
    constructor(inputStream, inputNewLineSymbol)
    {
        super();
        this.inputStream = inputStream;
        this.inputNewLineSymbol = inputNewLineSymbol;
    }

    innerRun(scope)
    {
        let parametersList = scope.getParametersList();
        console.log('parametersList ', parametersList);

        let arg = readlineSync.question('Enter arg \n');
        console.log('arg', arg);

        // let argObj = new ScalarVariable(arg, null);
        scope.setParametersList();
    }
};