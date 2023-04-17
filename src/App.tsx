import React, { useRef, useState } from "react";
import "./App.css";
// import Header from "./Header";
// import Footer from "./Footer";
import { getCombination, getExponent, getCoefficient, getHex } from "./Decimal64FtpConverter";
import { roundDecimalOption } from "./RoundingCalculator";

function App(): JSX.Element {
  const decimalInput = useRef<HTMLInputElement>(null);
  const exponentInput = useRef<HTMLInputElement>(null);
  
  const [roundingOption, setRoundingOption] = useState("truncate");
  const [specialCase, setSpecialCase] = useState("");
  const [binary, setBinary] = useState("");
  const [hex, setHex] = useState("");

  function handleBinaryConvert(): void {
    let [inputDecimal, inputExponent] = getInputValues();
    const [isFail, needRoundOff] = checkDirtyInput(inputDecimal);
    
    let exponentOffset = 0;

    console.log(isFail, needRoundOff);
  
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
      exponentOffset = getExponentOffset(parseFloat(inputDecimal).toString());
    }    
    const newExponent = (parseInt(inputExponent) - exponentOffset).toString();
    console.log(exponentOffset, newExponent);
    console.log(inputDecimal, inputExponent);

    const sign = inputDecimal[0] === "-" ? "1" : "0";
    let inputClean = inputDecimal.replace(".","");
    inputClean = inputClean.replace("-", "").length < 16 ? zeroExtend(inputClean, 16).replace("-", "") : inputClean.replace("-", "");
    console.log("inputClean:", inputClean);
    const combinationField = getCombination(inputClean[0], newExponent);
    const exponentContinuation = getExponent(newExponent);
    const coefficientContinuation = getCoefficient(inputClean);
    const binaryString = `${sign}${combinationField}${exponentContinuation}${coefficientContinuation}`;
    setBinary(`${sign} ${combinationField} ${exponentContinuation} ${coefficientContinuation}`);
    setHex(getHex(binaryString));
  }

  function roundDecimal(input: string, roundOption:string): string[] {
    let roundIt = false;
    let isRtne = false;
    const isNegative = input[0] === "-";
    const copyStart = isNegative ? 1 : 0;
    const copyEnd = isNegative ? 17 : 16;
    const copy = input.substring(copyStart,copyEnd).replace(".", "");
    const cleanInput = input.replace(".", "");
    let inputTrimmed = input.substring(copyStart,copyEnd);
    if(inputTrimmed.includes(".")) inputTrimmed = input.substring(copyStart, copyEnd+1);
    const exponentOffset = getExponentOffset(parseFloat(inputTrimmed).toString());
    console.log("rounding exponentOffset:", input.substring(copyStart,copyEnd), exponentOffset);
    roundIt = roundDecimalOption(cleanInput.substring(copyEnd-1, copyEnd+1), roundOption, isNegative);
    isRtne = cleanInput.substring(17, input.length).match(/[1-9]/g) !== null;
    if (roundIt || isRtne) {
      const rounded = parseFloat(copy) + 1;
      const sign = isNegative ? "-" : "";
      if(rounded.toString().length > 16) return [sign+rounded.toString().substring(0,16), exponentOffset.toString()]; 
      return [sign+rounded.toString(), exponentOffset.toString()];
    }
    return [copy, exponentOffset.toString()];
  }

  function checkDirtyInput(input: string): boolean[]{ // returns [isFail, needRoundOff]
    let isOnlyZero = true;
    let digits = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === "-") {
        if (i !== 0) return [true, false];
        continue;
      }
      if (input[i] === ".") {
        if (i === 1){
          if (input[0] === "-") return [true, false];
        }
        continue;
      }
      if (isNaN(parseInt(input[i]))) return [true, false];
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
    if (digits > 16) return [false, true];
    return [false, false];
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

  return (
    <div className="App">
      {/* <Header /> */}
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-col text-center items-center w-full mb-12">
            <img src="/dec64.svg" className="w-24 h-24 text-white logo rounded-full mb-3" alt="Dec64 logo" />
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              IEEE-754 Decimal-64 floating-point converter
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Simply enter the corresponding inputs, and the website will generate its equivalent in hexadecimal and
              binary format, along with additional information about its sign, exponent, and mantissa.
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
                  <li><a onClick={() => {setSpecialCase("+infinity")}}>+Infinity</a></li>
                  <li><a onClick={() => {setSpecialCase("-infinity")}}>-Infinity</a></li>
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

          <div className="flex flex-col text-center w-full mt-12">
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              {binary !== "" ? <>Binary: {binary}</> : <>Binary output...</>}
            </p>
            <p>
              {hex !== "" ? <>Hexadecimal: {hex}</> : <>Hexadecimal output...</>}
            </p>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
