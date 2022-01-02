import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class ProcedureType extends TypeBase
{
    constructor(symbol, signature, identifiers)
    {
        super(symbol, TypesIds.PROCEDURE);
        this.identifiers = identifiers;
        this.signature = signature;
    }


    toString()
    {
        let signatureTexts = [];

        if (this.signature.length > 0) {
            this.signature.forEach(function (elem, index) {
                let idents = elem.identifiers.map((identifier) => identifier.symbol.stringValue).join(', ');
                signatureTexts[index] = idents + ': ' + elem.type.toString();
            });
        }

        let signatureText = signatureTexts.join('; ');

        return `procedure(${signatureText})`;
    }
};