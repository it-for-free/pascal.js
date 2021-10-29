import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class FunctionType extends TypeBase
{
    constructor(symbol, signature = null, returnType = null)
    {
        super(symbol, TypesIds.FUNCTION);
        this.returnType = returnType;
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

        return `function(${signatureText}): ${this.returnType.toString()}`;
    }
};