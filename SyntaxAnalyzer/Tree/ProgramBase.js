const TreeNodeBase = require('./TreeNodeBase.js');

module.exports = class ProgramBase extends TreeNodeBase
{
    constructor(symbol)
    {
        super(symbol);
        this.name = null;
        this.vars = [];
        this.procedures = [];
        this.functions = [];
        this.sentences = [];
    }
};