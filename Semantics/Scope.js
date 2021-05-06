const TypesIds = require('./Variables/TypesIds.js');
const ScalarVariable = require('./Variables/ScalarVariable.js');
//const SimpleVariablesType = require('./SyntaxAnalyzer/Tree/SimpleVariablesType.js');


module.exports = class Scope
{
    constructor(parentScope = null)
    {
        this.parentScope = parentScope;
        this.items = {}
    }

    addVariable(name, typeId, value = null)
    {
        if (this.items.hasOwnProperty(name.toLowerCase())) {
            // already declared
        } else {
            this.items[name] = new ScalarVariable(value, typeId);
        }

    }

    setValue(name, typeId, value)
    {
        if (!this.items.hasOwnProperty(name.toLowerCase())) {
            // not declared
        } else {
            let item = this.items[name];
            if (item instanceof ScalarVariable) {
                if (item.typeId === typeId) {
                    this.items[name].value = value;
                } else {
                    // types mismatch
                }
            }

        }
    }

    getVariable(name)
    {
        this.items.hasOwnProperty(name.toLowerCase());
    }
}