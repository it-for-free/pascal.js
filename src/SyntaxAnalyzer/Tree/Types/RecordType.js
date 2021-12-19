import { TypeBase } from './TypeBase';
import { TypesIds } from '../../../Semantics/Variables/TypesIds';

export class RecordType extends TypeBase
{
    constructor(symbol, typesArray)
    {
        super(symbol, TypesIds.RECORD);

        let self = this;
        this.typesList = {};

        typesArray.forEach(elem => {
            let type = elem.type;
            elem.identifiers.forEach(identifier => {
                let propertyName = identifier.symbol.value;
                self.typesList[propertyName] = type;
            });
        })
    }

    toString()
    {
        let properties = [];
        let propertyName = null;

        for (propertyName in this.typesList) {
            properties.push(`${propertyName}: ` + this.typesList[propertyName].toString());
        }

        let types = properties.join(', ');
        return `record(${types})`;
    }
}
