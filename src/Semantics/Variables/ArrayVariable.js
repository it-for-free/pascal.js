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
        this.parentArray = null;
    }

    setValue(indexRing, type, value)
    {
        let indexExpression = indexRing.indexExpression;
        let index = this.scope.getIntegerValueOfIndexVariable(indexExpression) + this.offset;

        if (index < 0 || index >= this.arrayLength) {
            this.scope.addError(ErrorsCodes.indexIsOutOfRange, '', indexRing);
        } else if (typeof this.items[index] === 'undefined') {
            this.items[index] = this.scope.createVariable(this.type.typeOfElements, value);
        }
        let item = this.items[index];
        if (indexRing.indexRing === null) {
            let variable = this.scope.createVariable(this.type.typeOfElements, value);
            item.value = variable.value;
        } else if (indexRing.indexRing instanceof IndexRing) {
            item.setValue(indexRing.indexRing, type, value);
        }
    }

    getByIndexRing(indexRing)
    {
        let indexExpression = indexRing.indexExpression;
        let index = this.scope.getIntegerValueOfIndexVariable(indexExpression) + this.offset;
        if (index < 0 || index >= this.arrayLength) {
            this.scope.addError(ErrorsCodes.indexIsOutOfRange, '', indexRing);
        } else if (typeof this.items[index] === 'undefined') {
            this.scope.addError(ErrorsCodes.elementIsNotInitialized, '', indexRing);
        } else {
            let foundItem = this.items[index];
            return  indexRing.indexRing instanceof IndexRing ?
                    foundItem.getByIndexRing(indexRing.indexRing) :
                    foundItem;
        }
    }
}