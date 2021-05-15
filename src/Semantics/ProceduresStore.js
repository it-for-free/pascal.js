const Scope = require('./ProcedureItem.js');

module.exports = class ProceduresStore
{
    constructor()
    {
        this.items = {};
    }

    addProcedure(name, vars = [], parameters = [], sentences = [])
    {
        if (this.items.hasOwnProperty(name.toLowerCase())) {
            // already declared
        } else {
            this.items[name] = new ProcedureItem(vars, parameters, sentences);
        }
    }

    getVariable(name)
    {
        this.items.hasOwnProperty(name.toLowerCase());
    }
};