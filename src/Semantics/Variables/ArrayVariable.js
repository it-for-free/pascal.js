import { TypesIds } from './TypesIds';
import { BaseVariable } from './BaseVariable';
import { ArrayType } from '../../SyntaxAnalyzer/Tree/Types/ArrayType';
import { IndexRing } from '../../SyntaxAnalyzer/Tree/Arrays/IndexRing';
import { ErrorsCodes } from '../../Errors/ErrorsCodes';

export class ArrayVariable extends BaseVariable
{
    constructor(type, scope)
    {
        super();
        this.typeId = TypesIds.ARRAY;
        this.type = type;
        this.scope = scope;
        this.items = [];

        this.leftIntegerIndex = 0;
        this.rightIntegerIndex = null;
        this.offset = null;
        this.arrayLength = null;
    }

    setValue(indexRing, type, value)
    {
        let indexExpression = indexRing.evaluatedIndexExpression;
        let index = this.scope.getIntegerValueOfIndexVariable(indexExpression) + this.offset;

        if (index < 0 || index >= this.arrayLength) {
            this.scope.addError(ErrorsCodes.indexIsOutOfRange, '', indexRing);
        } else if (typeof this.items[index] === 'undefined') {
            this.items[index] = this.scope.createVariable(this.type.typeOfElements, value);
        }
        let item = this.items[index];
        if (indexRing.indexRing === null) {
            item.value = value.value;
        } else if (indexRing.indexRing instanceof IndexRing) {
            item.setValue(indexRing.indexRing, type, value);
        }
    }

    getByIndexRing(indexRing)
    {
        let indexExpression = indexRing.evaluatedIndexExpression;
        let index = this.scope.getIntegerValueOfIndexVariable(indexExpression) + this.offset;
        if (index < 0 || index >= this.arrayLength) {
            this.scope.addError(ErrorsCodes.indexIsOutOfRange, '', indexRing);
        } else {
            if (typeof this.items[index] === 'undefined') {
                 this.items[index] = this.scope.createDefaultVariable(this.type.typeOfElements);
            }
            let foundItem = this.items[index];
            return  indexRing.indexRing instanceof IndexRing ?
                    foundItem.getByIndexRing(indexRing.indexRing) :
                    foundItem;
        }
    }

    clone()
    {
        let copyArrayVariable = new ArrayVariable(this.type, this.scope);

        copyArrayVariable.rightIntegerIndex = this.rightIntegerIndex;
        copyArrayVariable.offset = this.offset;
        copyArrayVariable.arrayLength = this.arrayLength;
        copyArrayVariable.parentArray = this.parentArray;

        this.items.forEach(
            (item, index) => { copyArrayVariable.items[index] = item.clone(); }
        );

        return copyArrayVariable;
    }
}