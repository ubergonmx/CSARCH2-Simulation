import React, { useState } from "react";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import { getcombination, getexponent } from "./exponent";

function App(): JSX.Element {
  const [inputDecimal, setInputDecimal] = useState("");
  const [binary, setBinary] = useState("");

  function handleBinaryConvert(): void {
    const msd = "7";
    const combifield = getcombination(msd, inputDecimal);
    console.log(combifield);
    const exponentfield = getexponent(inputDecimal);
    console.log(exponentfield);
    setBinary(combifield + "  " + exponentfield);
    // console.log(inputDecimal);
    // console.log(convert(inputDecimal));
    // setBinary(convert(inputDecimal));
  }

  // create a function that sign extends a binary string
  function signExtend(binary: string, length: number): string {
    // eslint-disable-line
    const bit = binary[0] === "1" ? "1" : "0";
    for (let i = binary.length; i < length; i++) {
      binary = bit + binary;
    }
    return binary;
  }

  // create a function that returns two's complement of a binary string
  function twosComplement(binary: string): string {
    // eslint-disable-line
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
              <label htmlFor="full-name" className="leading-7 text-sm text-gray-400">
                Decimal (up to 16 digit)
              </label>
              <input
                onChange={(e) => {
                  setInputDecimal(e.target.value);
                }}
                type="text"
                id="full-name"
                name="full-name"
                className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative sm:mb-0 flex-grow w-full">
              <label htmlFor="email" className="leading-7 text-sm text-gray-400">
                Exponent
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={handleBinaryConvert}
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Convert
            </button>
          </div>

          <div className="flex flex-col text-center w-full mt-12">
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              {binary !== "" ? <>Output: {binary}</> : <>Waiting...</>}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;
