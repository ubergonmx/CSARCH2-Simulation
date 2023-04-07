import Decimal from "decimal.js";

// gets exponent field from given exponent
export function getExponent(exponent: string): string {
  const solvedExponent = solveExponent(exponent);
  const exponentField = solvedExponent.substring(2);
  return exponentField;
}

// gets combination field from given exponent and msd
export function getCombination(msd: string, exponent: string): string {
  let combifield = "";
  const solvedExponent = solveExponent(exponent); // solved exponent is the exponent added to 398 and is in 10 bit format
  console.log(solvedExponent);
  const tempDec = new Decimal(msd);
  let msdbin = tempDec.toBinary().replace("0b", "");
  if (msdbin.length < 3) {
    while (msdbin.length !== 3) {
      msdbin = "0" + msdbin;
    }
  }
  if (parseInt(msd) < 8) {
    combifield += solvedExponent.substring(0, 2);
    combifield += msdbin;
  } else {
    // if msd is 8 or 9
    combifield = "11";
    combifield += solvedExponent.substring(0, 2); // get first two bits of exponent
    combifield += msdbin[msdbin.length - 1]; // get lsb of msd
  }
  return combifield;
}

function solveExponent(exponent: string): string {
  let exponentBin = "";
  let exponentDec;

  exponent = (parseInt(exponent) + 398).toString();
  exponentDec = new Decimal(exponent);
  exponentBin = exponentDec.toBinary().replace("0b", "");
  if (exponentBin.length < 10) {
    while (exponentBin.length !== 10) {
      exponentBin = "0" + exponentBin;
    }
  }
  return exponentBin;
}
