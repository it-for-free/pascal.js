export function getNumberOfDigits(number)
{
    return (number < 10 ? 1 : Math.floor(Math.log10(number))) + 1;
}