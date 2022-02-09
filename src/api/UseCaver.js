import axios from "axios";
import Caver from "caver-js";
// import CounterABI from "../abi/CounterABI.json";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCRESS_KEY,
  NFT_CONTRACT_ADDRESS,
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

const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);

export const fetchCardsOf = async (address) => {
  // Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  console.log(`[NFT Balance] ${balance}`);
  // Fetch Token IDs
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    tokenIds.push(id);
  }
  // Fetch Token URIs
  const tokenUris = [];
  for (let i = 0; i < balance; i++) {
    const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call(); // -> metadata kas 주소
    console.log(1, metadataUrl);
    const response = await axios.get(metadataUrl); // 실제 메타데이터가 들어있다.
    console.log(2, response);
    const uriJSON = response.data;
    tokenUris.push(uriJSON.image);
    console.log(3, tokenUris);
  }
  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ uri: tokenUris[i], id: tokenIds[i] });
  }
  console.log(nfts);
  return nfts;
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

// const countContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

// export const readCount = async () => {
//   const _count = await countContract.methods.count().call();
//   console.log(_count);
// };

// export const setCount = async (newCount) => {
//   // 사용할 account 설정
//   try {
//     const privatekey =
//       "0x36801b8673ae4b9384b31a235197c68ca236b1dbf24980198c8ab9a9a9610219";
//     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
//     caver.wallet.add(deployer);
//     // 스마트 컨트랙트 실행 트랜잭션 날리기
//     // 결과확인 (콘솔이나 klaytn ide에서)
//     const receipt = await countContract.methods.setCount(newCount).send({
//       from: deployer.address, //address
//       gas: "0x4bf3200",
//     });
//     console.log(receipt);
//   } catch (e) {
//     console.log(`[ERROR_SET_COUNT]${e}`);
//   }
// };

// 1. Start Contract 배포 주소 파악 (가져오기)
// 2. caver.js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터)를 앱에 표현하기
