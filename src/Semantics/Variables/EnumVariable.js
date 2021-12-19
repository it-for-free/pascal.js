import { TypesIds } from './TypesIds';
import { BaseVariable } from './BaseVariable';

export class EnumVariable extends BaseVariable
{
    constructor(identifier, type)
    {
        super();
        this.value = identifier;
        this.typeId = TypesIds.ENUM;
        this.type = type;
    }

    getIndex()
    {
        let len = this.type.items.length;
        for (let i = 0; i < len; i++) {
            let item = this.type.items[i];
            if (item.symbol.stringValue.toLowerCase() === this.value.symbol.stringValue.toLowerCase()) {
                return i;
            }
        }
    }

    clone()
    {
        return new EnumVariable(this.value, this.type);
    }
}