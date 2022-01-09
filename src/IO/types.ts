import { ErrorsDescription } from "src/Errors/ErrorsDescription";
import { RuntimeError } from "src/Errors/RuntimeError";
import { ListingOutput } from "./Output/types";
import { TextPosition } from "./TextPosition";


export interface IO
{
    positionNow: TextPosition;
    printer: ListingOutput;
    currentLine:  string[];
    currentLineErrors: RuntimeError[];
    lines: string[];
    linePointer: number;
    endOfFile: boolean;
}