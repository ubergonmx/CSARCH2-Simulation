import Decimal from "decimal.js";

// gets exponent field from given exponent
export function getExponent(exponent: string): string {
  const solvedExponent = solveExponent(exponent);
  const exponentField = solvedExponent.substring(2);
  return exponentField;
}

// gets combination field from given exponent and msd
export function getCombination(msd: string, exponent: string): string {
  let combinationField = "";
  const solvedExponent = solveExponent(exponent); // solved exponent is the exponent added to 398 and is in 10 bit format
  console.log(solvedExponent);
  const tempDec = new Decimal(msd);
  let msdBinary = tempDec.toBinary().replace("0b", "");
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

function solveExponent(exponent: string): string {
  exponent = (parseInt(exponent) + 398).toString();
  const exponentDec = new Decimal(exponent);
  let exponentBin = exponentDec.toBinary().replace("0b", "");
  if (exponentBin.length < 10) {
    while (exponentBin.length !== 10) {
      exponentBin = "0" + exponentBin;
    }
  }
  return exponentBin;
}
