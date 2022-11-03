import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useWeb3React } from "@web3-react/core";
import { getMaxSupply, getCurrentSupply } from "./ContractFunction";

const NFTCard = () => {
    const {
        active,
        chainId,
        account,
    } = useWeb3React();

    const [totalMinted, setTotalMinted] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);

    async function handleStats() {
        getCurrentSupply(1).then(setTotalMinted);
        getMaxSupply(1).then(setMaxSupply);
    }

    useEffect(() => {
        if (chainId == 1) {
            handleStats();
        }
    }, [chainId]);

    return (
        <div className="flex-container">
            <div className="flex-container">
                <img src="/ripgang/Drip_teaser.png" alt="NFT Card" className="nft-card-image" />
            </div>
            <Button
                onClick={() => setModalShow(true)}
                className="button-mint"
            >
                DRIP KILLER
            </Button>
            {chainId === 1 &&
                <>
                    <p className="w-100 text-center mt-2">{maxSupply} EDICIONES</p>
                    <p className="w-100 text-center mt-2">xxx ETH</p>
                </>
            }
        </div>
    )
}

export default NFTCard