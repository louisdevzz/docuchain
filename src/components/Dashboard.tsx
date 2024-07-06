import { Alchemy, Network } from "alchemy-sdk";
import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3DCard";


export default function Dashboard(){
    const [allNFTs, setAllNFTs] = useState<any>([]);

    useEffect(()=>{
        loadNFTs()
    },[])

    const loadNFTs = async() =>{
        const config = {
            apiKey: process.env.ALCHEMY,
            network: Network.ETH_SEPOLIA,
        };
        const alchemy = new Alchemy(config);
        const address = "0x53191dB16a946E5aC8205Dd1a49528730b92b5c0";

        // Flag to omit metadata
        const omitMetadata = false;

        // Get all NFTs
        const response = await alchemy.nft.getNftsForContract(address, {
            omitMetadata: omitMetadata,
        });
        setAllNFTs(response.nfts)
        //console.log(JSON.stringify(response, null, 2));
    }
    console.log("nfts",allNFTs)
    return(
        <div className="flex flex-row gap-3 px-5 flex-wrap mt-10">
            {allNFTs.map((nft:any)=>(
                <CardContainer className="max-w-80 -mt-20">
                    <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1]  border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                        <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-neutral-600"
                        >
                        {nft.raw.metadata.name}
                        </CardItem>
                        <CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm mt-2s"
                        >
                        {nft.raw.metadata.description?nft.raw.metadata.description:nft.raw.metadata.school}
                        </CardItem>
                        <CardItem translateZ="100" className="w-full mt-4">
                        <img
                            src={nft.raw.metadata.image}
                            height="550"
                            width="550"
                            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                            alt="thumbnail"
                        />
                    </CardItem>
                </CardBody>
            </CardContainer>
            ))}   
        </div>
    )
}   