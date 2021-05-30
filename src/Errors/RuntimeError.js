export class RuntimeError extends Error
{
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