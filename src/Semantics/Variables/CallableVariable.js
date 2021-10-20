import { BaseVariable } from './BaseVariable';

export class CallableVariable extends BaseVariable
{
    constructor(type, value = null)
    {
        super();
        this.type = type;
        this.typeId = type.typeId;
        this.value = value;
    }
}