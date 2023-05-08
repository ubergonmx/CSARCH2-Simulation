import React, { useRef, useState } from "react";
import "./App.css";
import Header from "./Header";
// import Footer from "./Footer";
import { getCombination, getExponent, getCoefficient, getHex } from "./Decimal64FtpConverter";
import { roundDecimalOption } from "./RoundingCalculator";
import { downloadFile } from "./DownloadFile";

function App(): JSX.Element {
  const decimalInput = useRef<HTMLInputElement>(null);
  const exponentInput = useRef<HTMLInputElement>(null);
  
  const [roundingOption, setRoundingOption] = useState("truncate");
  const [specialCase, setSpecialCase] = useState("");
  const [binary, setBinary] = useState("");
  const [hex, setHex] = useState("");

  function handleBinaryConvert(): void {
    if (specialCase !== "") {
      console.log("special case:", specialCase)
      specialCases(specialCase);
      return;
    }

    let [inputDecimal, inputExponent] = getInputValues();
    const [isFail, needRoundOff, isOnlyZero] = checkDirtyInput(inputDecimal);
    
    let exponentOffset = 0;
    console.log("getInputValues()", inputDecimal, inputExponent)
    console.log("checkDirtyInput()", isFail, needRoundOff);
  
    if (isFail) {
      setBinary("Invalid input");
      setHex("Invalid input");
      return;
    }
    if (needRoundOff) {
      console.log("rounding");
      let exponent;
      [inputDecimal, exponent] = roundDecimal(inputDecimal, roundingOption);
      exponentOffset = parseInt(exponent);
      console.log("rounded exp:",exponent);
    }
    else{
      exponentOffset = getExponentOffset(isOnlyZero ? parseDecimal(inputDecimal) : inputDecimal); // prev used parseDecimal
    }    
    const newExponent = (parseInt(inputExponent) - exponentOffset).toString();
    console.log(exponentOffset, newExponent);
    console.log(inputDecimal, inputExponent);

    if(parseInt(newExponent) < -398){
      setBinary("Exponent out of range");
      setHex("Exponent out of range");
      return;
    }
    const isNegative = inputDecimal[0] === "-";
    if(parseInt(newExponent) > 369){
      specialCases(isNegative ? "-Infinity" : "+Infinity")
      console.log("infinity");
      return;
    }
    
    const sign = isNegative ? "1" : "0";
    let inputClean = inputDecimal.replace(".","");
    inputClean = inputClean.replace("-", "").length < 16 ? zeroExtend(inputClean, 16).replace("-", "") : inputClean.replace("-", "").substring(0,16);
    console.log("inputClean:", inputClean);
    const combinationField = getCombination(inputClean[0], newExponent);
    const exponentContinuation = getExponent(newExponent);
    const coefficientContinuation = getCoefficient(inputClean);
    const binaryString = `${sign}${combinationField}${exponentContinuation}${coefficientContinuation}`;
    setBinary(`${sign} ${combinationField} ${exponentContinuation} ${coefficientContinuation}`);
    setHex(getHex(binaryString) as string);
  }

  function roundDecimal(input: string, roundOption:string): string[] {
    let roundIt = false;
    let isRtne = false;
    const isNegative = input[0] === "-";
    const sign = isNegative ? "-" : "";
    const copyStart = isNegative ? 1 : 0;
    const copyEnd = isNegative ? 17 : 16;
    const extraDigits = input.substring(copyEnd, input.length);
    
    let pointBelow16Digits = false;
    let inputTrimmed = input.substring(copyStart,copyEnd);
    console.log("inputTrimmed:", inputTrimmed);
    if(inputTrimmed.includes(".")) {
      pointBelow16Digits = true;
      inputTrimmed = input.substring(copyStart,copyEnd+1);
    }
    let exponentOffset = getExponentOffset(inputTrimmed);
    console.log("inputTrimmed2:", inputTrimmed, extraDigits, exponentOffset);
    if(!pointBelow16Digits){
      for(let i = 0; i < extraDigits.length; i++){
        if(extraDigits[i] === ".") break;
        exponentOffset--;
      }
    }
    console.log("rounding exponentOffset:", input.substring(copyStart,copyEnd), exponentOffset);

    const copy = input.substring(copyStart,pointBelow16Digits?copyEnd+1:copyEnd).replace(".", "");
    const cleanInput = input.replace(".", "");
    
    roundIt = roundDecimalOption(cleanInput.substring(copyEnd-1, copyEnd+1), roundOption, isNegative);
    console.log(`substring(${copyEnd-1}, ${copyEnd+1})`,cleanInput.substring(copyEnd-1, copyEnd+1), roundIt);
    isRtne = roundOption === 'rtne' && input.substring(copyEnd+1, input.length).match(/[1-9]/g) !== null;
    if (roundIt || isRtne) {
      const rounded = roundIt? parseFloat(copy) + 1 : parseFloat(copy);
      if(rounded.toString().length > 16) return [sign+rounded.toString().substring(0,16), exponentOffset.toString()]; 
      return [sign+rounded.toString(), exponentOffset.toString()];
    }
    return [sign+copy, exponentOffset.toString()];
  }

  function parseDecimal(value: string): string {
    const num = parseFloat(value);
    const decimalPart = value.split('.')[1] ?? "";
    if (decimalPart !== undefined && decimalPart !== "" && decimalPart.match(/^[0]+$/) !== null) {
      return "0";
    } 
  
    return num.toFixed(decimalPart.length);
  }

  function checkDirtyInput(input: string): [boolean, boolean, boolean]{ // returns [isFail, needRoundOff]
    let isOnlyZero = true;
    let digits = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === "-") {
        if (i !== 0) return [true, false, isOnlyZero];
        continue;
      }
      if (input[i] === ".") {
        if (i === 1){
          if (input[0] === "-") return [true, false, isOnlyZero];
        }
        continue;
      }
      if (isNaN(parseInt(input[i]))) return [true, false, isOnlyZero];
      if (isOnlyZero && input[i] === "0") {
        continue;
      }
      if (isOnlyZero && input[i] !== "0") {
        isOnlyZero = false;
      }
      if (!isOnlyZero){
        digits++;
        continue;
      }
    }
    console.log(digits);
    if (digits > 16) return [false, true, isOnlyZero];
    return [false, false, isOnlyZero];
   }

  function getInputValues(): string[] {
    const inputDecimal = decimalInput.current?.value;
    const inputExponent = exponentInput.current?.value;
    return [(inputDecimal === undefined || inputDecimal === "") ? "0.0" : inputDecimal, (inputExponent === undefined || inputExponent === "") ? "0" : inputExponent];
  }

  // create a function that sign extends a decimal string
  function zeroExtend(decimal: string, length: number): string {
    // remove the sign
    const sign = decimal.includes ("-") ? "-" : "";
    decimal = decimal.replace("-", "");
    for (let i = decimal.length; i < length; i++) {
      decimal = "0" + decimal;
    }
    return sign + decimal;
  }
  // create a function that sign extends a binary string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function signExtendBinary(binary: string, length: number): string { 
    const bit = binary[0] === "1" ? "1" : "0";
    for (let i = binary.length; i < length; i++) {
      binary = bit + binary;
    }
    return binary;
  }

  // create a function that returns two's complement of a binary string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function twosComplement(binary: string): string {
    let found = false;
    if (binary[0] === "-") {
      binary = binary.substring(1);
      for (let i = binary.length; i >= 0; i--) {
        if (binary[i] === "1" && !found) {
          found = true;
          continue;
        }
        if (found) {
          if (binary[i] === "1") {
            binary = binary.substring(0, i) + "0" + binary.substring(i + 1);
          } else {
            binary = binary.substring(0, i) + "1" + binary.substring(i + 1);
          }
        }
      }
      binary = "1" + binary;
    } else binary = "0" + binary;
    return binary;
  }

  function getExponentOffset(inputDecimal: string): number{
    console.log("inputDecimal:", inputDecimal);
    let offset = inputDecimal.indexOf(".");
    offset = offset !== -1 ? inputDecimal.length - offset - 1 : 0
    return offset;
  }

  function specialCases(input :string) :void{
    switch (input) {
        case "+Infinity":
            setBinary("0 11110 11111111 00000000000000000000000000000000000000000000000000");
            setHex("7BFC000000000000");
            break;
        case "-Infinity":
            setBinary("1 11110 11111111 00000000000000000000000000000000000000000000000000");
            setHex("FBFC000000000000");
            break;
        case "NaN":
            setBinary("0 11111 11111111 00000000000000000000000000000000000000000000000000");
            setHex("7FFC000000000000");
            break;
        default:
            break;
    }
  }
  
  function styleToolTip(text: string, tip: string, space:boolean = true): JSX.Element {
    const style = space ? "inline-flex flex-wrap px-2 py-1 rounded-lg text-xs font-medium leading-4 bg-gray-800 text-gray-300 ml-1" : "inline-flex flex-wrap px-2 py-1 rounded-lg text-xs font-medium leading-4 bg-gray-800 text-gray-300";
    return <div className={style+" hover:bg-primary ease-in-out transition-colors tooltip tooltip-primary"} data-tip={tip}>
      {text}
    </div>
  }

  function textToolTip(text: string, tip: string): JSX.Element {
     return <span className="hover:bg-primary ease-in-out transition-all tooltip tooltip-primary" data-tip={tip}>
      {text}
    </span>
  }

  function binaryFormatByParts(output: string) : JSX.Element {
    const binary = output.split(" ");
    const sign = styleToolTip(binary[0], "Sign bit", false);
    const combinationField = styleToolTip(binary[1], "Combination field");
    const exponentField = styleToolTip(binary[2], "Exponent field");
    const coefficientContinuation = styleToolTip(binary[3], "Coefficient continuation");
    return <div className="inline-flex flex-wrap">{sign} {combinationField} {exponentField} {coefficientContinuation}</div>
  }

  function hexFormatByParts(output: string) : JSX.Element {
    const [, fhh, shh, fhb, shb] = getHex(output, true);
    const firstHalf = textToolTip(fhh, separateStr(fhb, ' ', 4));
    const secondHalf = textToolTip(shh, separateStr(shb, ' ', 4)); 
    return <div className="inline-flex flex-wrap px-2 py-1 rounded-lg text-xs font-medium leading-4 bg-gray-800 text-gray-300">{firstHalf}{secondHalf}</div>
  }

  function separateStr(str : string, divider :string,  n:number) : string
    {
          var ret=[];

          for(let i=0; i<str.length; i=i+n) 
          {
                ret.push(str.substr(i, n))
          };

          return ret.join(divider);
    };

    separateStr('123456789', '.',  3);

  return (
    <div className="App">
      <Header />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-col text-center items-center w-full mb-12">
            <img src="/dec64.svg" className="w-24 h-24 text-white logo rounded-full mb-3" alt="Dec64 logo" />
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              IEEE-754 Decimal-64 floating-point converter
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Simply enter the corresponding inputs to generate its equivalent in hexadecimal and binary format. 
              In binary output, you can hover to see what part is the sign, combination field, exponent field, and coefficient continuation.
            </p>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:px-0 items-end sm:space-x-4 sm:space-y-0 space-y-4">
            <div className="relative sm:mb-0 flex-grow">
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="btn bg-gray-800 hover:border-gray-800  border-gray-700">{
                  specialCase === "" ? "No special case" : specialCase
                  }</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => {setSpecialCase("")}}>None</a></li>
                  <li><a onClick={() => {setSpecialCase("+Infinity")}}>+Infinity</a></li>
                  <li><a onClick={() => {setSpecialCase("-Infinity")}}>-Infinity</a></li>
                  <li><a onClick={() => {setSpecialCase("NaN")}}>NaN</a></li>
                </ul>
              </div>
            </div>
            <div className="relative sm:mb-0 flex-grow">
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="btn bg-gray-800 hover:border-gray-800  border-gray-700">{ roundingOption }</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => {setRoundingOption("truncate")}}>Truncate</a></li>
                  <li><a onClick={() => {setRoundingOption("ceiling")}}>Ceiling</a></li>
                  <li><a onClick={() => {setRoundingOption("floor")}}>Floor</a></li>
                  <li><a onClick={() => {setRoundingOption("rtne")}}>Round to nearest (TE)</a></li>
                </ul>
              </div>
            </div>
            <div className="relative sm:mb-0 flex-grow w-96">
              <label htmlFor="decimal" className="leading-7 text-sm text-gray-400">
                Decimal (up to 16 digits)
              </label>
              <input
                ref={decimalInput}
                placeholder="0.0"
                type="number"
                id="decimal"
                name="decimal"
                className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="flex-grow w-16">
              <p className="text-lg text-center" >x 10</p>
            </div>
            <div className="relative sm:mb-0 flex-grow-0 w-36">
              <label htmlFor="exponent" className="leading-7 text-sm text-gray-400">
                Exponent
              </label>
              <input
                ref={exponentInput}
                placeholder="0"
                type="number"
                id="exponent"
                name="exponent"
                className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={handleBinaryConvert}
              // className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              className="btn btn-primary"
            >
              Convert
            </button>
          </div>

          <div className="flex flex-col text-center w-full mt-12 items-center">
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              {binary !== "" ? <>Binary: {binaryFormatByParts(binary)}</> : <>Binary output...</>}
            </p>
            <p>
              {hex !== "" ? <>Hexadecimal: {hexFormatByParts(binary.split(" ").join(""))}</> : <>Hexadecimal output...</>}
            </p>
            {binary !== "" && hex !== "" && (
              <button
                onClick={()=>{
                  downloadFile("output.txt", `Binary: ${binary}\nHexadecimal: ${hex}`)
                }}
                className="btn btn-ghost w-64"
              >
                Download output.txt
              </button>
            )}
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
