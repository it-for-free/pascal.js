export class BaseVariable
{
    constructor()
    {
    }

    getType(value, typeId)
    {
        return this.type ? this.type : this.typeId;
    }
}