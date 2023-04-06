import Decimal from "decimal.js";

// assumes input is correct: 3 digit num formatted as a string
// returns 10 bit dpd of the corresponding 3 digit num as a string
export function convert(three_digit_num: string): string {
  let majors = "";
  let encodeddpd = "";
  let dpd = "";
  for (let i = 0; i < three_digit_num.length; i++) {
    majors = parseInt(three_digit_num[i]) < 8 ? (majors += "0") : (majors += "1");
  }
  encodeddpd = getencodedstring(majors);
  dpd = getdpd(encodeddpd, three_digit_num);
  return dpd;
}

function getencodedstring(majors: string): string {
  let encodeddpd = "";
  switch (
    majors // m was replaced by l for indexing to work
  ) {
    case "000":
      encodeddpd = "bcdfgh0jkl";
      break;
    case "001":
      encodeddpd = "bcdfgh100l";
      break;
    case "010":
      encodeddpd = "bcdjkh101l";
      break;
    case "011":
      encodeddpd = "bcd10h111l";
      break;
    case "100":
      encodeddpd = "jkdfgh110l";
      break;
    case "101":
      encodeddpd = "fgd01h111l";
      break;
    case "110":
      encodeddpd = "jkd00h111l";
      break;
    case "111":
      encodeddpd = "00d11h111l";
      break;
  }
  return encodeddpd;
}

function getdpd(encodeddpd: string, three_digit_num: string): string {
  let bin = "";
  let tempdigit = "";
  let dpd = "";

  for (let i = 0; i < three_digit_num.length; i++) {
    tempdigit = "";
    const digit = new Decimal(three_digit_num[i]);
    tempdigit += digit.toBinary().replace("0b", "");
    if (tempdigit.length < 4) {
      while (tempdigit.length != 4) {
        tempdigit = "0" + tempdigit;
      }
    }
    bin += tempdigit;
  }

  for (let i = 0; i < encodeddpd.length; i++) {
    let index = encodeddpd[i];
    console.log(index);
    if (index != "0" && index != "1") {
      index = (index.charCodeAt(0) - "a".charCodeAt(0)).toString();
      dpd += bin[parseInt(index)];
    } else {
      dpd += index;
    }
  }

  return dpd;
}
