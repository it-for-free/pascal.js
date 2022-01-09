
import fs from 'fs';
import { BaseIO } from './BaseIO';
import { ListingOutput } from './Output/types';


export class FileIO extends BaseIO
{
    constructor(fileName: string, printer: ListingOutput)
    {
        super(printer);

        var data = fs.readFileSync(fileName, 'utf-8');
        this.setLines(data);
    }
}