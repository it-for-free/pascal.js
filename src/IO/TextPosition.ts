export interface TextPosition {
    lineNumber: number;
    charNumber: number;
}

export class TextPosition implements TextPosition
{
    constructor(lineNumber = 0, charNumber = 0)
    {
        this.lineNumber = lineNumber;
        this.charNumber = charNumber;
    }
}