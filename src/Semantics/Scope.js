const TypesIds = require('./Variables/TypesIds.js');
const ScalarVariable = require('./Variables/ScalarVariable.js');


module.exports = class Scope
{
    constructor(parentScope = null)
    {
        this.parentScope = parentScope;
        this.items = {}
    }

    addVariable(name, typeId, value = null)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            // already declared
        } else {
            this.items[lowerCaseName] = new ScalarVariable(value, typeId);
        }
    }

    setValue(name, typeId, value)
    {
        let lowerCaseName = name.toLowerCase();
        if (!this.items.hasOwnProperty(lowerCaseName)) {
            // not declared
        } else {
            let item = this.items[lowerCaseName];
            if (item instanceof ScalarVariable) {
                if (item.typeId === typeId) {
                    this.items[lowerCaseName].value = value;
                } else {
                    // types mismatch
                }
            }
        }
    }

    getVariable(name)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            return this.items[lowerCaseName];
        }
    }
}