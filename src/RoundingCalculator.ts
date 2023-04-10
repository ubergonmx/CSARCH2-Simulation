// all functions assume that input is greater than 16 digits and proper number format
// returns rounded 16 digit number
export function truncate(input: string): string {
    const sign = input[0] === "-" ? -1: 1;
    if(sign === -1) // if negative, remove - 
        input = input.substring(1);
    const signSymbol = sign === -1 ? "-":"";
    const length = input.includes(".") ? 17 : 16
    return signSymbol + input.substring(0,length);
}

export function ceiling(input: string): string {
    const sign = input[0] === "-" ? -1: 1;
    if(sign === -1) // if negative, remove - 
        input = input.substring(1);
    const signSymbol = sign === -1 ? "-":"";
    const length = input.includes(".") ? 17 : 16;

    let numberToRound = input.substring(length-1, input.length);
    numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
    numberToRound = (parseFloat(numberToRound) * sign).toString();
    const lastDigit = Math.ceil(parseFloat(numberToRound)) * sign;
    const roundedNumber = input.substring(0, length-1);
    return signSymbol + roundedNumber + lastDigit.toString();
}

export function floor(input: string): string {
    const sign = input[0] === "-" ? -1: 1;
    if(sign === -1) // if negative, remove - 
        input = input.substring(1);
    const signSymbol = sign === -1 ? "-":"";
    const length = input.includes(".") ? 17 : 16;

    let numberToRound = input.substring(length-1, input.length);
    numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
    numberToRound = (parseFloat(numberToRound) * sign).toString();
    const lastDigit = Math.floor(parseFloat(numberToRound)) * sign;
    const roundedNumber = input.substring(0, length-1);
    return signSymbol + roundedNumber + lastDigit.toString();
}

export function rtne(input: string): string {
    const sign = input[0] === "-" ? -1: 1;
    if(sign === -1) // if negative, remove - 
        input = input.substring(1);
    const signSymbol = sign === -1 ? "-":"";

    const length = input.includes(".") ? 17 : 16;
    let numberToRound = input.substring(length-1, input.length);
    numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
    let lastDigit = 0;
    if(parseFloat(numberToRound) % 1 === 0.5){ // if decimal portion is .5, tie to closest even
        lastDigit = 2 * Math.round(parseFloat(numberToRound)/2);
    }
    else{ // else do normal rounding
        lastDigit = Math.round(parseFloat(numberToRound));
    }
    const roundedNumber = input.substring(0, length-1);
    return signSymbol + roundedNumber + lastDigit.toString();
}

