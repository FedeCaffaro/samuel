// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";


contract Kolapse is ERC721, Ownable, Pausable{
    using SafeMath for uint256;
    string _baseTokenURI;
    string _contractURI;
    uint256 public constant maxSupply = 20;
    uint256 public mintPrice = 1000000000000000; // 0.001 ETH

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol){
    _pause();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
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

    function mintKolapse(uint256 tokenId) public payable whenNotPaused{
        require(
            mintPrice <= msg.value,
            "ETH sent is incorrect."
        );
        require(
            tokenId<=maxSupply, "Token Id not available for buying"
        );
        _safeMint(msg.sender, tokenId);
    }

    function reserve(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function exists(uint256 tokenId) public view returns (bool tokenExists){
        return _exists(tokenId);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(
            balance);
    }
}
