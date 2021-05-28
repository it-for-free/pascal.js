export class RuntimeError extends Error
{
    constructor(errorCode, errorText, textPosition)
    {
        super();
        this.errorCode = errorCode;
        this.errorText = errorText;
        this.textPosition = textPosition;
    }
}