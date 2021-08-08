import { Interface } from "readline";
import { TextPosition } from "../IO/TextPosition";

export interface RuntimeErrorInterface extends Error {
    errorCode: number;
    errorText: number;
    textPosition: TextPosition;
};

export class RuntimeError extends Error implements RuntimeErrorInterface  
{
    errorCode;
    errorText;
    textPosition;

    constructor(errorCode, errorText, textPosition)
    {
        super(errorText 
            + ` // line ${textPosition.lineNumber} `
            + ` column ${textPosition.charNumber} `);
        this.errorCode = errorCode;
        this.errorText = errorText;
        this.textPosition = textPosition;
    }
}