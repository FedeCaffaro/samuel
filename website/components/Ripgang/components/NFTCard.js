import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useWeb3React } from "@web3-react/core";
import { getMaxSupply, getCurrentSupply } from "./ContractFunction";

const NFTCard = ({
    id,
    img_url,
    video_url,
    name,
    description,
    artist,
    origin,
    price,
    quantity,
    setNftModalShow,
    setModalData
}) => {
    const {
        active,
        chainId,
        account,
    } = useWeb3React();

    const [totalMinted, setTotalMinted] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);

    async function handleStats(id) {
        getCurrentSupply(id).then(setTotalMinted);
        getMaxSupply(id).then(setMaxSupply);
    }

    useEffect(() => {
        if (chainId == 1) {
            handleStats(id);
        }
    }, [chainId]);

    const handleClick = () => {
        setModalData({
            artist,
            id,
            img_url,
            video_url,
            name,
            description,
            origin,
            price,
            quantity
        });
        setNftModalShow(true);
    }

    return (
        <div className="flex-container">
            <div className="flex-container m-0">
                {video_url ? (
                    <video className='videoTag'
                        autoPlay
                        loop
                        muted
                        playsInline
                    // onLoadedData={onVideoLoaded}
                    // style={{ display: isVideoLoaded ? "block" : "none" }}
                    >
                        <source src={`/ripgang/${video_url}`} type='video/mp4' />
                    </video>
                ) : (
                    <img src={`/ripgang/${img_url}`} alt="NFT Card" className="nft-card-image" />
                )}
            </div>
            <Button
                onClick={handleClick}
                className="button-mint"
            >
                {name}
            </Button>
            {chainId === 1 &&
                <>
                    <p className="w-100 text-center mt-2 mb-0">{maxSupply} EDICIONES</p>
                    <p className="w-100 text-center">xxx ETH</p>
                </>
            }
        </div>
    )
}

export default NFTCard