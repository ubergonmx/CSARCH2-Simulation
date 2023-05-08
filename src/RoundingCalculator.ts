// // all functions assume that input is greater than 16 digits and proper number format
// // returns rounded 16 digit number
// export function truncate(input: string): string {
//     const sign = input[0] === "-" ? -1: 1;
//     if(sign === -1) // if negative, remove -
//         input = input.substring(1);
//     const signSymbol = sign === -1 ? "-":"";
//     const length = input.includes(".") ? 17 : 16
//     return signSymbol + input.substring(0,length);
// }

// export function ceiling(input: string): string {
//     const sign = input[0] === "-" ? -1: 1;
//     if(sign === -1){ // if negative, remove -
//         input = input.substring(1);
//     }

//     const signSymbol = sign === -1 ? "-":"";
//     const length = input.includes(".") ? 17 : 16;
//     const dotIndex = input.indexOf(".");
//     const decimalPlaces = length - dotIndex -1;

//     let numberToRound = input.substring(length-1, input.length);
//     numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
//     numberToRound = (parseFloat(numberToRound) * sign).toString();
//     const lastDigit = Math.ceil(parseFloat(numberToRound)) * sign;
//     let roundedNumber = input.substring(0, length-1);

//     roundedNumber = lastDigit === 10?  roundedNumber = adder(roundedNumber, decimalPlaces, length)
//                                     : roundedNumber = roundedNumber + lastDigit.toString();

//     return signSymbol + roundedNumber;
// }

// export function floor(input: string): string {
//     const sign = input[0] === "-" ? -1: 1;
//     if(sign === -1){ // if negative, remove -
//         input = input.substring(1);
//     }

//     const signSymbol = sign === -1 ? "-":"";
//     const length = input.includes(".") ? 17 : 16;
//     const dotIndex = input.indexOf(".");
//     const decimalPlaces = length - dotIndex -1;

//     let numberToRound = input.substring(length-1, input.length);
//     numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
//     numberToRound = (parseFloat(numberToRound) * sign).toString();
//     const lastDigit = Math.floor(parseFloat(numberToRound)) * sign;
//     let roundedNumber = input.substring(0, length-1);

//     roundedNumber = lastDigit === 10?  roundedNumber = adder(roundedNumber, decimalPlaces, length)
//                                     : roundedNumber = roundedNumber + lastDigit.toString();

//     return signSymbol + roundedNumber;
// }

// export function rtne(input: string): string {
//     const sign = input[0] === "-" ? -1: 1;
//     if(sign === -1){ // if negative, remove -
//         input = input.substring(1);
//     }

//     const signSymbol = sign === -1 ? "-":"";
//     const dotIndex = input.indexOf(".");
//     const length = input.includes(".") ? 17 : 16;

//     const decimalPlaces = length - dotIndex -1;
//     let numberToRound = input.substring(length-1, input.length);
//     numberToRound = numberToRound.slice(0,1) + "." + numberToRound.slice(1);
//     let lastDigit = 0;
//     if(parseFloat(numberToRound) % 1 === 0.5){ // if decimal portion is .5, tie to closest even
//         lastDigit = 2 * Math.round(parseFloat(numberToRound)/2);
//     }
//     else{ // else do normal rounding
//         lastDigit = Math.round(parseFloat(numberToRound));
//     }

//     let roundedNumber = input.substring(0, length-1);

//     roundedNumber = lastDigit === 10?  roundedNumber = adder(roundedNumber, decimalPlaces, length)
//                                     : roundedNumber = roundedNumber + lastDigit.toString();

//     return signSymbol + roundedNumber;
// }

// function adder(roundedNumber: string, decimalPlaces :number, length: number) :string{
//     const adder = 0.1 * Math.pow(10, - (decimalPlaces - 2));
//     roundedNumber = (parseFloat(roundedNumber) + adder).toString();
//     if(!roundedNumber.includes(".")){
//         roundedNumber += ".";
//     }
//     if(roundedNumber.length < length){
//         while(roundedNumber.length !== length){
//             roundedNumber += "0";
//         }
//     }
//     return roundedNumber;
// }

export function roundDecimalOption(input: string, roundOption: string, isNegative: boolean): boolean {
  input = input.slice(0, 1) + "." + input.slice(1);
  let roundedInput = 0;
  switch (roundOption) {
    case "truncate":
      return false;
    case "ceiling":
      return !isNegative;
    case "floor":
      return isNegative;
    case "rtne":
      if (parseFloat(input) % 1 === 0.5) {
        // if decimal portion is .5, tie to closest even
        roundedInput = 2 * Math.round(parseFloat(input) / 2);
      } else {
        // else do normal rounding
        roundedInput = Math.round(parseFloat(input));
      }
      return Math.abs(roundedInput) > Math.abs(parseFloat(input));
    default:
      return false;
  }
}
