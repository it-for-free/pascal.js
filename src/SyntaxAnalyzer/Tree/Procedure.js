const ProgramBase = require('./ProgramBase.js');

module.exports = class Procedure extends ProgramBase
{
    constructor(symbol)
    {
        super(symbol);
        this.signature = [];
    }
};