const ProgramBase = require('./ProgramBase.js');

module.exports = class Function extends ProgramBase
{
    constructor(symbol)
    {
        super(symbol);
        this.returnType = null;
        this.signature = [];
    }
}