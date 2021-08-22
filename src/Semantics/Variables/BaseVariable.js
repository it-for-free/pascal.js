export class BaseVariable
{
    constructor()
    {
        this.type = null;
        this.typeId = null;
//        let self = this;
//        this.getType = function () {
//            return self.type ? self.type : self.typeId;
//        }
    }

    getType()
    {
        return this.type ? this.type : this.typeId;
    }
}