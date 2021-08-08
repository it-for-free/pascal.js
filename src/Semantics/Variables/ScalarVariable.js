import { BaseVariable } from './BaseVariable';

export class ScalarVariable extends BaseVariable
{
    constructor(value, typeId)
    {
        super();
        this.value = value;
        this.typeId = typeId;
        this.type = false;
    }
}