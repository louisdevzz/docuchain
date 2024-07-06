import {
    createSmartAccountClient,
} from "@biconomy/account";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

export const connectWallet = async () => {
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
    return smartWallet;
};