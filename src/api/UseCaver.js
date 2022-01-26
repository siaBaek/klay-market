import Caver from "caver-js";
import CounterABI from "../abi/CounterABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCRESS_KEY,
  COUNT_CONTRACT_ADDRESS,
  CHAIN_ID,
} from "../constants";

const option = {
  headers: [
    {
      name: "Authorization",
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCRESS_KEY).toString(
          "base64"
        ),
    },
    {
      name: "X-chain-id",
      value: CHAIN_ID,
    },
  ],
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);

const countContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

export const readCount = async () => {
  const _count = await countContract.methods.count().call();
  console.log(_count);
};

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};

export const setCount = async (newCount) => {
  // 사용할 account 설정
  try {
    const privatekey =
      "0x36801b8673ae4b9384b31a235197c68ca236b1dbf24980198c8ab9a9a9610219";
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    // 스마트 컨트랙트 실행 트랜잭션 날리기
    // 결과확인 (콘솔이나 klaytn ide에서)
    const receipt = await countContract.methods.setCount(newCount).send({
      from: deployer.address, //address
      gas: "0x4bf3200",
    });
    console.log(receipt);
  } catch (e) {
    console.log(`[ERROR_SET_COUNT]${e}`);
  }
};

// 1. Start Contract 배포 주소 파악 (가져오기)
// 2. caver.js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터)를 앱에 표현하기
