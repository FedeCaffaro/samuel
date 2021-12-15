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
 * @title MintTest
 * MintTest - a contract for Testing
 */

abstract contract SamotToken {
    function balanceOf(address owner)
        public
        view
        virtual
        returns (uint256 balance);

    function claim(address _claimer, uint256 _reward) external {}

    function burn(address _from, uint256 _amount) external {}
}

contract MintTest is ERC721Tradable {
    using SafeMath for uint256;
    uint256 public mintPrice = 1;
    uint256 public mintTokenPrice = 1000000000000000000; // 1 Token
    uint256 public discountPrice;
    uint256 public constant MAX_SUPPLY = 8888;
    uint256 public maxToMint = 5;
    bool public saleIsActive = false;
    string _baseTokenURI;
    string _contractURI;
    address[] whitelistAddr;
    SamotToken token;

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

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function setMintTokenPrice(uint256 _mintTokenPrice) external onlyOwner {
        mintTokenPrice = _mintTokenPrice;
    }

    function setTokenDiscount(uint256 _discount) external onlyOwner {
        discount = _discount;
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function reserve(address to, uint256 numberOfTokens) public onlyOwner {
        uint256 i;
        for (i = 0; i < numberOfTokens; i++) {
            mintTo(to);
        }
    }

    function mintWithERC20(uint256 numberOfTokens) public payable {
        require(saleIsActive, "Sale is not active.");
        require(
            totalSupply().add(numberOfTokens) <= MAX_SUPPLY,
            "Sale has already ended."
        );
        require(numberOfTokens > 0, "numberOfTokens cannot be 0.");
        require(
            token.balanceOf(msg.sender) >= mintTokenPrice.mul(numberOfTokens),
            "You do not have enough $AMOT tokens."
        );
        require(
            (mintPrice.mul(numberOfTokens)).div(discount) <= msg.value,
            "ETH sent is incorrect."
        );

        for (uint256 i = 0; i < numberOfTokens; i++) {
            mintTo(msg.sender);
        }

        token.burn(msg.sender, mintTokenPrice.mul(numberOfTokens));
    }

    function burnTest(uint256 _amount) external onlyOwner {
        token.burn(msg.sender, _amount);
    }

    function claimTest(uint256 _amount) external onlyOwner {
        token.claim(msg.sender, _amount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}

// Si es 1155 se puede hacer un mapping con cada ID y su precio y descuento
