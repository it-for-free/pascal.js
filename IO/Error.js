module.exports = class Error
{
    constructor(errorCode, textPosition)
    {
        this.errorCode = errorCode;
        this.textPosition = textPosition;
    }
}