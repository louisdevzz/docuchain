import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  createSmartAccountClient,
} from "@biconomy/account";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

export default function Header() {
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(
    null
  );
  const [isShow,setIsShow] = useState<boolean>(false);

  useEffect(()=>{
    setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
  },[smartAccountAddress])

  const connect = async () => {
    try {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0xaa36a7",
        rpcTarget: "https://eth-sepolia.public.blastapi.io",
        displayName: "Ethereum Sepolia",
        blockExplorer: "https://sepolia.etherscan.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      }

      //Creating web3auth instance
      const web3auth = new Web3Auth({
        clientId:
          "BF7VNWZp3xcReMTWGjVyaDIaroawluipOGC9Kfrhq1FgNK_cx1G1Dhxnt3skEH6ZYrODKXhUGJEA0rVCAXbublo", // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig,
        uiConfig: {
          appName: "UniCert On-Chain",
          mode: "dark", // light, dark or auto
          loginMethodsOrder: ["apple", "google", "twitter"],
          logoLight: "https://web3auth.io/images/web3auth-logo.svg",
          logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          loginGridCol: 3,
          primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
        },
      });

      await web3auth.initModal();
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider as any
      );
      const web3AuthSigner = ethersProvider.getSigner();

      const config = {
        biconomyPaymasterApiKey: "pg90HOfS1.2b0110e8-eed6-41b3-a3c6-efc4742f148c",
        bundlerUrl: `https://bundler.biconomy.io/api/v2/11155111/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      };

      const smartWallet = await createSmartAccountClient({
        signer: web3AuthSigner,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
        rpcUrl: "https://eth-sepolia.public.blastapi.io",
        chainId: 11155111,
      });

      console.log("Biconomy Smart Account", smartWallet);
      //localStorage.setItem("smartWallet",JSON.stringify(smartWallet));
      const saAddress = await smartWallet.getAccountAddress();
      console.log("Smart Account Address", saAddress);
      setSmartAccountAddress(saAddress);
      localStorage.setItem("smartAccountAddress",saAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const truncate = (str:string) =>{
    if(str && str.length > 30){
      return str.slice(0,5)+'...'+str.slice(-5);
    }
    return str;
  }

  return (
    <div className="hidden md:flex h-20 justify-center mx-auto border-b border-gray-200">
      <div className="w-full flex max-w-screen-xl">
        <div className="flex flex-row w-full justify-between items-center">
            <div>
              <Link href={""}>
                Logo
              </Link>
            </div>
            <ul className="flex flex-row justify-between items-center gap-3">
              <li>a</li>
              <li>b</li>
              <li>c</li>
              <li>d</li>
            </ul>
            <div>
              {smartAccountAddress
              ?
                <div className="relative">
                  <span onClick={()=>setIsShow((prv)=>!prv)} className="cursor-pointer bg-black hover:bg-opacity-80 text-white font-semibold px-4 py-2 h-12 rounded-lg">{truncate(smartAccountAddress)}</span>
                  <div className={`${isShow?"visible":"invisible"} absolute px-2 py-3 top-10 shadow-md rounded-md border border-gray-100 w-40 left-0 bg-white`}>
                    <div className="mt-2 flex flex-col gap-3">
                      <button className="hover:border-r-2 hover:bg-gray-100 py-1 bg-opacity-90 border-gray-200 pr-16 pl-2">Log out</button>
                      <button className="hover:border-r-2 hover:bg-gray-100 py-1 bg-opacity-90 border-gray-200 pr-16 pl-2">Profile</button>
                    </div>
                  </div>
                </div>
              :
                <button onClick={connect} className="bg-black text-white font-semibold px-4 py-2 h-12 rounded-lg hover:bg-opacity-80">
                  Connect Wallet
                </button>
              }
            </div>
        </div>
      </div>
    </div>
  );
}
