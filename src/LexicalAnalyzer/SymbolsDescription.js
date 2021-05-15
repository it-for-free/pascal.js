import { SymbolsCodes } from './SymbolsCodes';

export class SymbolsDescription
{
    constructor()
    {
        this.symbolCodeMapper = new Map([
            [SymbolsCodes.star, '*'],
            [SymbolsCodes.slash, '/'],
            [SymbolsCodes.equal, '='],
            [SymbolsCodes.comma, ','],
            [SymbolsCodes.semicolon, ';'],
            [SymbolsCodes.colon, ':'],
            [SymbolsCodes.point, '.'],
            [SymbolsCodes.arrow, '^'],
            [SymbolsCodes.leftPar, '('],
            [SymbolsCodes.rightPar, ')'],
            [SymbolsCodes.lBracket, '['],
            [SymbolsCodes.rBracket, ']'],
            [SymbolsCodes.flPar, '{'],
            [SymbolsCodes.frPar, '}'],
            [SymbolsCodes.later, '<'],
            [SymbolsCodes.greater, '>'],
            [SymbolsCodes.laterEqual, '<='],
            [SymbolsCodes.greaterEqual, '>='],
            [SymbolsCodes.laterGreater, '<>'],
            [SymbolsCodes.plus, '+ '],
            [SymbolsCodes.minus, '- '],
            [SymbolsCodes.lComment, '(*'],
            [SymbolsCodes.rComment, '*)'],
            [SymbolsCodes.assign, ':='],
            [SymbolsCodes.twoPoints, '..'],
            [SymbolsCodes.ident, 'Identifier'],
            [SymbolsCodes.floatC, 'Float Constant'],
            [SymbolsCodes.intC, 'Integer Constant'],
            [SymbolsCodes.charC, 'Character Constant'],
            [SymbolsCodes.caseSy, 'case'],
            [SymbolsCodes.elseSy, 'else'],
            [SymbolsCodes.fileSy, 'file'],
            [SymbolsCodes.gotoSy, 'goto'],
            [SymbolsCodes.thenSy, 'then'],
            [SymbolsCodes.untilSy, 'until'],
            [SymbolsCodes.doSy, 'do'],
            [SymbolsCodes.withSy, 'with'],
            [SymbolsCodes.ifSy, 'if'],
            [SymbolsCodes.ofSy, 'of'],
            [SymbolsCodes.orSy, 'or'],
            [SymbolsCodes.inSy, 'in'],
            [SymbolsCodes.toSy, 'to'],
            [SymbolsCodes.endSy, 'end'],
            [SymbolsCodes.varSy, 'var'],
            [SymbolsCodes.divSy, 'div'],
            [SymbolsCodes.andSy, 'and'],
            [SymbolsCodes.notSy, 'not'],
            [SymbolsCodes.forSy, 'for'],
            [SymbolsCodes.modSy, 'mod'],
            [SymbolsCodes.nilSy, 'nil'],
            [SymbolsCodes.setSy, 'set'],
            [SymbolsCodes.typeSy, 'type'],
            [SymbolsCodes.realSy, 'real'],
            [SymbolsCodes.beginSy, 'begin'],
            [SymbolsCodes.whileSy, 'while'],
            [SymbolsCodes.arraySy, 'array'],
            [SymbolsCodes.constSy, 'const'],
            [SymbolsCodes.labelSy, 'label'],
            [SymbolsCodes.downtoSy, 'downto'],
            [SymbolsCodes.stringSy, 'string'],
            [SymbolsCodes.packedSy, 'packed'],
            [SymbolsCodes.recordSy, 'record'],
            [SymbolsCodes.repeatSy, 'repeat'],
            [SymbolsCodes.integerSy, 'integer'],
            [SymbolsCodes.programSy, 'program'],
            [SymbolsCodes.functionSy, 'function'],
            [SymbolsCodes.procedureSy, 'procedure'],
        ]);
    }

    getSymbolTextByCode(symbolCode)
    {
        return  this.symbolCodeMapper.has(symbolCode) ?
                this.symbolCodeMapper.get(symbolCode) :
                null;
    }
}