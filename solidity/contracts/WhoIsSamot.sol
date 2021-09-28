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
 * @title WhoIsSamot
 * WhoIsSamot - a contract for Who Is Samot NFTs
 */
contract WhoIsSamot is ERC721Tradable {
    using SafeMath for uint256;
    address constant WALLET1 = 0xc4eeB8020e539C70Ecbd6464F7dB3Fe61de91986; // Z
    uint256 public constant MAX_SUPPLY = 5000;
    bool public saleIsActive = false;
    bool public preSaleIsActive = false;
    uint256 public mintPrice = getNFTPrice();
    uint256 public maxToMint = 10;
    uint256 public maxToMintWhitelist = 20;
    string _baseTokenURI;
    string _contractURI;
    address[] whitelistAddr;

    constructor(address _proxyRegistryAddress, address[] memory addrs)
        ERC721Tradable("Who Is Samot", "SAMOT", _proxyRegistryAddress)
    {
        whitelistAddr = addrs;
        for (uint256 i = 0; i < whitelistAddr.length; i++) {
            addAddressToWhitelist(whitelistAddr[i]);
        }
    }

    struct Whitelist {
        address addr;
        uint256 hasMinted;
    }
    mapping(address => Whitelist) public whitelist;

    struct Burnlist {
        address addr;
        uint256 burnCount;
    }
    mapping(address => Burnlist) public burnlist;

    function baseTokenURI()
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _baseTokenURI;
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

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function setMaxToMint(uint256 _maxToMint) external onlyOwner {
        maxToMint = _maxToMint;
    }

    function setMaxToMintWhitelist(uint256 _maxToMint) external onlyOwner {
        maxToMintWhitelist = _maxToMint;
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function flipPreSaleState() public onlyOwner {
        preSaleIsActive = !preSaleIsActive;
    }

    function addAddressToWhitelist(address addr)
        public
        onlyOwner
        returns (bool success)
    {
        require(!isWhitelisted(addr), "Already whitelisted");
        whitelist[addr].addr = addr;
        whitelist[addr].hasMinted = 0;
        success = true;
    }

    function addAddressesToWhitelist(address[] memory addrs)
        public
        onlyOwner
        returns (bool success)
    {
        whitelistAddr = addrs;
        for (uint256 i = 0; i < whitelistAddr.length; i++) {
            addAddressToWhitelist(whitelistAddr[i]);
        }
        success = true;
    }

    function isWhitelisted(address addr)
        public
        view
        returns (bool isWhiteListed)
    {
        return whitelist[addr].addr == addr;
    }

    function reserve(address to, uint256 numberOfTokens) public onlyOwner {
        uint256 i;
        for (i = 0; i < numberOfTokens; i++) {
            mintTo(to);
        }
    }

    function getNFTPrice() public view returns (uint256) {
        require(totalSupply() <= MAX_SUPPLY, "Sold out.");

        uint256 currentSupply = totalSupply();

        if (currentSupply >= 4000) {
            return 1000000000000000000; // 4000 - 5000 1 ETH
        } else if (currentSupply >= 3000) {
            return 800000000000000000; // 3000 - 4000 0.8 ETH
        } else if (currentSupply >= 2000) {
            return 600000000000000000; // 2000  - 3000 0.6 ETH
        } else if (currentSupply >= 1000) {
            return 400000000000000000; // 1000 - 2000 0.4 ETH
        } else {
            return 200000000000000000; // 0 - 1000 0.2 ETH
        }
    }

    function mint(address to, uint256 numberOfTokens) public payable {
        require(saleIsActive, "Sale is not active.");
        require(totalSupply().add(numberOfTokens) <= MAX_SUPPLY, "Sold out.");
        require(
            mintPrice.mul(numberOfTokens) <= msg.value,
            "ETH sent is incorrect."
        );
        if (preSaleIsActive) {
            require(
                numberOfTokens <= maxToMintWhitelist,
                "Exceeds wallet pre-sale limit."
            );
            require(isWhitelisted(to), "Your address is not whitelisted.");
            require(
                whitelist[to].hasMinted.add(numberOfTokens) <=
                    maxToMintWhitelist,
                "Exceeds per wallet pre-sale limit."
            );
            require(
                whitelist[to].hasMinted <= maxToMintWhitelist,
                "Exceeds per wallet pre-sale limit."
            );
            whitelist[to].hasMinted = whitelist[to].hasMinted.add(
                numberOfTokens
            );
        } else {
            require(
                numberOfTokens <= maxToMint,
                "Exceeds per transaction limit."
            );
        }

        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintTo(to);
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        uint256 wallet1Balance = balance.mul(5).div(100); // Z
        payable(WALLET1).transfer(wallet1Balance);
        payable(msg.sender).transfer(balance.sub(wallet1Balance));
    }
}
