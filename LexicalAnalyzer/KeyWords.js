const SymbolsCodes = require('./SymbolsCodes.js');

module.exports = class KeyWords
{
    constructor()
    {
        this.keyWordsCodes = new Map([
            ['if', SymbolsCodes.ifSy],
            ['do', SymbolsCodes.doSy],
            ['of', SymbolsCodes.ofSy],
            ['or', SymbolsCodes.orSy],
            ['in', SymbolsCodes.inSy],
            ['to', SymbolsCodes.toSy],
            ['end', SymbolsCodes.endSy],
            ['var', SymbolsCodes.varSy],
            ['div', SymbolsCodes.divSy],
            ['and', SymbolsCodes.andSy],
            ['not', SymbolsCodes.notSy],
            ['for', SymbolsCodes.forSy],
            ['mod', SymbolsCodes.modSy],
            ['nil', SymbolsCodes.nilSy],
            ['set', SymbolsCodes.setSy],
            ['then', SymbolsCodes.thenSy],
            ['else', SymbolsCodes.elseSy],
            ['case', SymbolsCodes.caseSy],
            ['file', SymbolsCodes.fileSy],
            ['goto', SymbolsCodes.gotoSy],
            ['type', SymbolsCodes.typeSy],
            ['with', SymbolsCodes.withSy],
            ['real', SymbolsCodes.realSy],
            ['begin', SymbolsCodes.beginSy],
            ['while', SymbolsCodes.whileSy],
            ['array', SymbolsCodes.arraySy],
            ['const', SymbolsCodes.constSy],
            ['label', SymbolsCodes.labelSy],
            ['until', SymbolsCodes.untilSy],
            ['downto', SymbolsCodes.downtoSy],
            ['packed', SymbolsCodes.packedSy],
            ['record', SymbolsCodes.recordSy],
            ['repeat', SymbolsCodes.repeatSy],
            ['program', SymbolsCodes.programSy],
            ['integer', SymbolsCodes.integerSy],
            ['function', SymbolsCodes.functionSy],
            ['procedure', SymbolsCodes.procedureSy]
        ]);
    }

    getSymbolCodeByKeyWord(keyWord)
    {
        let lowerCase = keyWord.toLowerCase();
        return  this.keyWordsCodes.has(lowerCase) ?
                this.keyWordsCodes.get(lowerCase) :
                SymbolsCodes.ident;
    }
}