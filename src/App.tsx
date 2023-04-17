import React, { useState } from "react";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import { getCombination, getExponent, getCoefficient, getHex } from "./Decimal64FtpConverter";

function App(): JSX.Element {
  const [inputDecimal, setInputDecimal] = useState("");
  const [inputExponent, setInputExponent] = useState("");
  const [binary, setBinary] = useState("");
  const [hex, setHex] = useState("");

  function handleBinaryConvert(): void {
    checkInputs();
    const sign = inputDecimal[0] === "-" ? "1" : "0";
    const exponentOffset = getExponentOffset(parseFloat(inputDecimal).toString());
    const newExponent = (parseInt(inputExponent) - exponentOffset).toString();
    let inputClean = inputDecimal.replace(".","");
    inputClean = inputClean.replace("-", "").length < 16 ? zeroExtend(inputClean, 16) : inputClean.replace("-", "");
    const combinationField = getCombination(inputClean[0], newExponent);
    const exponentContinuation = getExponent(newExponent);
    const coefficientContinuation = getCoefficient(inputClean);
    const binaryString = `${sign}${combinationField}${exponentContinuation}${coefficientContinuation}`;
    setBinary(`${sign} ${combinationField} ${exponentContinuation} ${coefficientContinuation}`);
    setHex(getHex(binaryString));
  }

  function checkInputs(): void {
    if(inputDecimal === "") setInputDecimal("0.0");
    if(inputExponent === "") setInputExponent("0");
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
              Simply enter the corresponding inputs, and the website will generate its equivalent in hexadecimal and
              binary format, along with additional information about its sign, exponent, and mantissa.
            </p>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:px-0 items-end sm:space-x-4 sm:space-y-0 space-y-4">
            <div className="relative sm:mb-0 flex-grow w-full">
              <label htmlFor="decimal" className="leading-7 text-sm text-gray-400">
                Decimal (up to 16 digits)
              </label>
              <input
                onChange={(e) => {
                  setInputDecimal(e.target.value);
                }}
                placeholder="0.0"
                type="number"
                id="decimal"
                name="decimal"
                className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="flex-grow w-16">
              <p className="text-lg" >x 10</p>
            </div>
            <div className="relative sm:mb-0 flex-grow-0 w-36">
              <label htmlFor="exponent" className="leading-7 text-sm text-gray-400">
                Exponent
              </label>
              <input
                onChange={(e) => {
                  setInputExponent(e.target.value);
                }}
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
      <Footer />
    </div>
  );
}

export default App;
