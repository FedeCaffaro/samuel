//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";

abstract contract SamotToken {
    
    function burn(address _from, uint256 _amount) external {}

    function balanceOf(address owner)
        public
        view
        virtual
        returns (uint256 balance);
}

contract PaymentProcessor {
    
    //Utils
    using SafeMath for uint256;

    //addresses
    address public samotTokenAddress;
    address public admin;

    //Contracts
    SamotToken token;


    constructor(address _adminAddress, address _samotTokenAddress){
        admin = _adminAddress;
        token = SamotToken(_samotTokenAddress);
    }

    // function setTokenContract(address _samotTokenAddress) public onlyOwner {
    //     token = SamotToken(_samotTokenAddress);
    // }

    // function pay(uint256 _amount,uint256 _paymentId,uint256 _tokenId) external {
    //     require(token.balanceOf(msg.sender) >= _amount,"You don't have enough tokens in your account");
    //     token.burn(msg.sender,_amount);
    //     _safeMint(msg.sender, _tokenId);
    // }


}
