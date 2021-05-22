

export class TypesStore
{
    constructor(parentScope = null)
    {
        this.items = {}
    }

    addType(name, type)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            // already declared
        } else {
            this.items[lowerCaseName] = type;
        }
    }


    getType(name)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            return this.items[lowerCaseName];
        }
    }
}