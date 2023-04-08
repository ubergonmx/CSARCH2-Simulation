import Decimal from "decimal.js";

// assumes input is correct: 3 digit num formatted as a string
// returns 10 bit dpd of the corresponding 3 digit num as a string
export function convertToDPD(threeDigitNum: string): string {
  let majors = "";
  let encodedDPD = "";
  let dpd = "";
  for (let i = 0; i < threeDigitNum.length; i++) {
    majors = parseInt(threeDigitNum[i]) < 8 ? (majors += "0") : (majors += "1");
  }
  encodedDPD = getEncodedString(majors);
  dpd = getDPD(encodedDPD, threeDigitNum);
  return dpd;
}

function getEncodedString(majors: string): string {
  let endcodedDPD = "";
  switch (
    majors // m was replaced by l for indexing to work
  ) {
    case "000":
      endcodedDPD = "bcdfgh0jkl";
      break;
    case "001":
      endcodedDPD = "bcdfgh100l";
      break;
    case "010":
      endcodedDPD = "bcdjkh101l";
      break;
    case "011":
      endcodedDPD = "bcd10h111l";
      break;
    case "100":
      endcodedDPD = "jkdfgh110l";
      break;
    case "101":
      endcodedDPD = "fgd01h111l";
      break;
    case "110":
      endcodedDPD = "jkd00h111l";
      break;
    case "111":
      endcodedDPD = "00d11h111l";
      break;
  }
  return endcodedDPD;
}

function getDPD(encodedDPD: string, threeDigitNum: string): string {
  let bin = "";
  let tempDigit = "";
  let dpd = "";

  for (let i = 0; i < threeDigitNum.length; i++) {
    tempDigit = "";
    const digit = new Decimal(threeDigitNum[i]);
    tempDigit += digit.toBinary().replace("0b", "");
    if (tempDigit.length < 4) {
      while (tempDigit.length !== 4) {
        tempDigit = "0" + tempDigit;
      }
    }
    bin += tempDigit;
  }

  for (let i = 0; i < encodedDPD.length; i++) {
    let index = encodedDPD[i];
    console.log(index);
    if (index !== "0" && index !== "1") {
      index = (index.charCodeAt(0) - "a".charCodeAt(0)).toString();
      dpd += bin[parseInt(index)];
    } else {
      dpd += index;
    }
  }

  return dpd;
}
