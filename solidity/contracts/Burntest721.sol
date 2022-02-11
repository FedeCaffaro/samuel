// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

// ██╗    ██╗██╗  ██╗ ██████╗     ██╗███████╗    ▄▄███▄▄· █████╗ ███╗   ███╗ ██████╗ ████████╗    ██████╗
// ██║    ██║██║  ██║██╔═══██╗    ██║██╔════╝    ██╔════╝██╔══██╗████╗ ████║██╔═══██╗╚══██╔══╝    ╚════██╗
// ██║ █╗ ██║███████║██║   ██║    ██║███████╗    ███████╗███████║██╔████╔██║██║   ██║   ██║         ▄███╔╝
// ██║███╗██║██╔══██║██║   ██║    ██║╚════██║    ╚════██║██╔══██║██║╚██╔╝██║██║   ██║   ██║         ▀▀══╝
// ╚███╔███╔╝██║  ██║╚██████╔╝    ██║███████║    ███████║██║  ██║██║ ╚═╝ ██║╚██████╔╝   ██║         ██╗
//  ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝     ╚═╝╚══════╝    ╚═▀▀▀══╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝    ╚═╝         ╚═╝

/**
 * @title Pyramyd
 * Pyramyd - a contract for Pyramyd NFTs
 */

abstract contract SamotToken {
    function claim(address _claimer, uint256 _reward) external {}

    function burn(address _from, uint256 _amount) external {}

    function balanceOf(address owner)
        public
        view
        virtual
        returns (uint256 balance);
}

abstract contract SamotNFT {
    function balanceOf(address owner)
        public
        view
        virtual
        returns (uint256 balance);
}

contract Pyramyd is ERC721Tradable {
    using SafeMath for uint256;
    address constant WALLET1 = 0xffe5CBCDdF2bd1b4Dc3c00455d4cdCcf20F77587;
    address constant WALLET2 = 0xD9CC8af4E8ac5Cb5e7DdFffD138A58Bac49dAEd5;
    uint256 public constant MAX_SUPPLY = 500;
    uint256 public maxToMint = 8;
    uint256 public maxToMintPerNFT = 1;
    uint256 public mintPrice = 1000000000000000; // 0.001 ETH
    uint256 public burningCost = 1000000000000000000; // 1 samot token
    uint256 public mintPricePreSale = 50000000000000000; // 0.05 ETH
    bool public saleIsActive = false;
    bool public preSaleIsActive = true;
    string _baseTokenURI;
    string _contractURI;
    SamotToken token;
    SamotNFT nft;

    constructor(
        address _proxyRegistryAddress,
        string memory _name,
        string memory _symbol
    ) ERC721Tradable(_name, _symbol, _proxyRegistryAddress) {}

    function baseTokenURI()
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _baseTokenURI;
    }

    function setNFTContract(address _contract) external onlyOwner {
        nft = SamotNFT(_contract);
    }

    function setTokenContract(address _contract) external onlyOwner {
        token = SamotToken(_contract);
    }

    function setBaseTokenURI(string memory _uri) public onlyOwner {
        _baseTokenURI = _uri;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function setContractURI(string memory _uri) public onlyOwner {
        _contractURI = _uri;
    }

    function setMaxToMint(uint256 _maxToMint) external onlyOwner {
        maxToMint = _maxToMint;
    }

    function setMintPricePreSale(uint256 _price) external onlyOwner {
        mintPricePreSale = _price;
    }

    function setMaxToMintPerNFT(uint256 _maxToMint) external onlyOwner {
        maxToMintPerNFT = _maxToMint;
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function flipPreSaleState() public onlyOwner {
        preSaleIsActive = !preSaleIsActive;
    }

    function reserve(address to, uint256 numberOfTokens) public onlyOwner {
        uint256 i;
        for (i = 0; i < numberOfTokens; i++) {
            mintTo(to);
        }
    }

    function mint(uint256 numberOfTokens) public payable {
        require(saleIsActive, "Sale is not active.");
        require(
            totalSupply().add(numberOfTokens) <= MAX_SUPPLY,
            "Sale has already ended."
        );
        require(numberOfTokens > 0, "numberOfTokens cannot be 0.");
        if (preSaleIsActive) {
            require(
                mintPricePreSale.mul(numberOfTokens) <= msg.value,
                "ETH sent is incorrect."
            );
        } else {
            require(
                mintPrice.mul(numberOfTokens) <= msg.value,
                "ETH sent is incorrect."
            );
            require(
                numberOfTokens <= maxToMint,
                "Exceeds per transaction limit."
            );
        }

        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintTo(msg.sender);
        }
    }

    function mintWithTokens(uint256 numberOfTokens) public {
        require(
            token.balanceOf(msg.sender) >= burningCost.mul(numberOfTokens),
            "Not enough samot tokens"
        );
        token.burn(msg.sender, burningCost);
        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintTo(msg.sender);
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        uint256 wallet1Balance = balance.mul(10).div(100);
        uint256 wallet2Balance = balance.mul(85).div(100);
        payable(WALLET1).transfer(wallet1Balance);
        payable(WALLET2).transfer(wallet2Balance);
        payable(msg.sender).transfer(
            balance.sub(wallet1Balance.add(wallet2Balance))
        );
    }
}
