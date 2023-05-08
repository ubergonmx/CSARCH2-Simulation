import { convertToDPD } from "./DPDSolver";

// gets exponent continuation from given exponent
export function getExponent(exponent: string): string {
  const solvedExponent = solveExponent(exponent);
  const exponentField = solvedExponent.substring(2);
  return exponentField;
}

// gets combination field from given exponent and msd
export function getCombination(msd: string, exponent: string): string {
  let combinationField = "";
  const solvedExponent = solveExponent(exponent); // solved exponent is the exponent added to 398 and is in 10 bit format
  let msdBinary = parseInt(msd, 10).toString(2);

  if (msdBinary.length < 3) {
    while (msdBinary.length !== 3) {
      msdBinary = "0" + msdBinary;
    }
  }
  if (parseInt(msd) < 8) {
    combinationField += solvedExponent.substring(0, 2);
    combinationField += msdBinary;
  } else {
    // if msd is 8 or 9
    combinationField = "11";
    combinationField += solvedExponent.substring(0, 2); // get first two bits of exponent
    combinationField += msdBinary[msdBinary.length - 1]; // get lsb of msd
  }
  return combinationField;
}

// gets coefficient continuation from remaining digits
export function getCoefficient(remainingDigits: string): string {
  let coefficientField = "";
  // omit msd
  remainingDigits = remainingDigits.substring(1);
  // starting from the lsd of the remaining digits, get the dpd of 3 digits and add it to the coefficient field
  for (let i = remainingDigits.length - 1; i >= 0; i -= 3) {
    const threeDigitNum = remainingDigits[i - 2] + remainingDigits[i - 1] + remainingDigits[i];
    coefficientField = convertToDPD(threeDigitNum) + coefficientField;
  }
  return coefficientField;
}

// gets the hexadecimal representation of the given binary string
export function getHex(binary: string, getAll: boolean = false): string | string[] {
  // split binary string into half
  const firstHalf = binary.substring(0, binary.length / 2);
  let f = parseInt(firstHalf, 2).toString(16).toUpperCase();
  while (f.length < 8) f = "0" + f;
  const secondHalf = binary.substring(binary.length / 2);
  let s = parseInt(secondHalf, 2).toString(16).toUpperCase();
  while (s.length < 8) s = "0" + s;
  return !getAll ? f + s : [f + s, f, s, firstHalf, secondHalf];
}

function solveExponent(exponent: string): string {
  let exponentBin = (parseInt(exponent) + 398).toString(2);
  if (exponentBin.length < 10) {
    while (exponentBin.length !== 10) {
      exponentBin = "0" + exponentBin;
    }
  }
  return exponentBin;
}
