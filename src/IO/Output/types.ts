import { RuntimeError } from "src/Errors/RuntimeError";

export interface ListingOutput
{
    errorsCounter: number;
    
    listLine: (line: string, number: number) => void;
    listErrors: (errors: RuntimeError[]) => void;
    getLinePrefix: (lineNumber: number) => void;

    getErrorText: (error: RuntimeError, errorNumber: number) => string;
    listError: (error: RuntimeError) => void;
}
