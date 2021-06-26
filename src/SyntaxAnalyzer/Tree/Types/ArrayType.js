import { TreeNodeBase } from '../TreeNodeBase';

export class ArrayType extends TreeNodeBase
{
    constructor(symbol, typeOfElements, indexFrom, indexTo, isPointer = false)
    {
        super(symbol);
        this.typeOfElements = typeOfElements;
        this.indexFrom = indexFrom;
        this.indexTo = indexTo;
        this.isPointer = isPointer;
    }
}