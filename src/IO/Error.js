module.exports = class Error
{
    constructor(errorCode, errorText, textPosition)
    {
        this.errorCode = errorCode;
        this.errorText = errorText;
        this.textPosition = textPosition;
    }
}