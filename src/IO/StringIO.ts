import { BaseIO } from './BaseIO';
import { ListingOutput } from './Output/types';

export class StringIO extends BaseIO
{
    constructor(programText: string, printer: ListingOutput)
    {
        super(printer);
        this.setLines(programText);
    }
}