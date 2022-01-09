import {ListingOutput} from './types';
import { BaseOutput } from './BaseOutput';

export class StringOutput  extends BaseOutput implements ListingOutput
{
    outputLines: string[] = [];

    listLine(line, number)
    {
        var output = this.getLinePrefix(number + 1) + line;
        this.outputLines.push(output.replace(/[\n\r]/g, ''));
    }

    listError(error)
    {
        this.outputLines.push(this.getErrorText(error, ++this.errorsCounter));
    }
}