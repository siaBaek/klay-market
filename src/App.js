/* eslint-disable */
import QRCode from "qrcode.react";
import { readCount, getBalance, setCount } from "./api/UseCaver";
import "./App.css";
import * as KlipAPI from "./api/UseKlip";
import { useState } from "react";

function onPressButton(balance) {
  console.log("hi");
}
const onPressButton2 = (_balance, _setBalance) => {
  _setBalance(_balance);
};
const DEFAULT_QR_CODE = "DEFAULT";

function App() {
  const [balance, setBalance] = useState("0");
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  // readCount();
  // getBalance("0xd216a6bebddeca9b862c1423b31cfa5188e5cb3c");
  const onClickGetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };
  const onClickSetCount = () => {
    KlipAPI.setCount(2000, setQrvalue);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            // onPressButton2("15", setBalance);
            onClickGetAddress();
          }}
        >
          주소 가져오기
        </button>
        <button
          onClick={() => {
            // onPressButton2("15", setBalance);
            onClickSetCount();
          }}
        >
          카운트 값 변경
        </button>
        <br />
        <QRCode value={qrvalue} />
        <p>{balance}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
