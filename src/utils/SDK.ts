import { ethers } from "ethers";
import { NFT } from "@/contract/contractNFT";
import {
    PaymasterMode,
} from "@biconomy/account";
import { connectWallet } from "@/utils/smartWallet";


export const MintNFT = async({smartAccountAddress,ipfs_cid}:{smartAccountAddress: string, ipfs_cid:string}) =>{
    const contractAddress = "0x53191dB16a946E5aC8205Dd1a49528730b92b5c0";
    const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-sepolia.public.blastapi.io"
    );
    
    const contractInstance = new ethers.Contract(
        contractAddress as string,
        NFT,
        provider
    );
    const minTx = await contractInstance.populateTransaction.safeMint(smartAccountAddress,ipfs_cid);
    console.log("Mint Tx Data", minTx.data);
    const tx1 = {
        to: contractAddress,
        data: minTx.data,
    };
    const smartAccount = await connectWallet();
    //@ts-ignore
    
    const userOpResponse = await smartAccount?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    });
    //@ts-ignore
    const { transactionHash } = await userOpResponse.waitForTxHash();
    //console.log("Transaction Hash", transactionHash);
    return transactionHash;
}