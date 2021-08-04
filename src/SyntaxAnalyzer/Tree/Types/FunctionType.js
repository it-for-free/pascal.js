import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class FunctionType extends TypeBase
{
    constructor(symbol, signature = null, returnType = null)
    {
        super(symbol, TypesIds.FUNCTION);
        this.returnType = returnType;
        this.signature = signature;
    }
};