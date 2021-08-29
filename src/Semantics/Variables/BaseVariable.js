export class BaseVariable
{
    constructor()
    {
        this.type = null;
        this.typeId = null;
    }

    getType()
    {
        return this.type ? this.type : this.typeId;
    }
}