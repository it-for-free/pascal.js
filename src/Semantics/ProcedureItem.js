const Scope = require('./Scope.js');

module.exports = class ProcedureItem
{
    constructor(vars = [], parameters = [], sentences = [])
    {
        this.vars = vars;
        this.parameters = parameters;
        this.sentences = sentences;
    }

    createScope(parameters = [], parentScope = null)
    {
        let scope = new Scope(parentScope);
        if (this.parameters.length === 0) {
            scope.addVariable(parameters)
        }
    }

    innerRun()
    {

    }
};