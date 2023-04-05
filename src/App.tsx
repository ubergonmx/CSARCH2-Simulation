import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Decimal from 'decimal.js'
import {convert} from './dpdsolver'


function App() {
  const [count, setCount] = useState(0);
  const [binary, setBinary] = useState("");

  function handleBinaryConvert(){
    const string = "431";
    setBinary(convert(string));

    // const result = new Decimal(418);
    // const bin = twosComplement(result.toBinary().replace('0b', ''));
    // console.log(bin);
    // console.log(signExtend(bin, 10));
    // setBinary(signExtend(bin, 10));
  }

  // create a function that sign extends a binary string
  function signExtend(binary : string, length : number) : string{
    const bit = binary[0] === '1' ? '1' : '0';
    for (let i = binary.length; i < length; i++) {
      binary = bit + binary;
    }
    return binary;
  }

  // create a function that returns two's complement of a binary string
  function twosComplement(binary : string) : string{
    var found = false;
    if(binary[0] === '-'){
      binary = binary.substring(1);
      for (let i = binary.length; i >= 0; i--) {
        if (binary[i] == '1' && !found) {
          found = true;
          continue;
        }
        if(found){
          if (binary[i] == '1') {
            binary = binary.substring(0, i) + '0' + binary.substring(i + 1);
          } else {
            binary = binary.substring(0, i) + '1' + binary.substring(i + 1);
          }
        }
      }
      binary = '1' + binary;
    }
    else binary = '0' + binary;
    return binary;
    
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <button onClick={handleBinaryConvert}>
          dpd is {binary}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
