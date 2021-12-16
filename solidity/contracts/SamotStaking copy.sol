// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/utils/structs/EnumerableSet.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";

// ██╗    ██╗██╗  ██╗ ██████╗     ██╗███████╗    ▄▄███▄▄· █████╗ ███╗   ███╗ ██████╗ ████████╗    ██████╗
// ██║    ██║██║  ██║██╔═══██╗    ██║██╔════╝    ██╔════╝██╔══██╗████╗ ████║██╔═══██╗╚══██╔══╝    ╚════██╗
// ██║ █╗ ██║███████║██║   ██║    ██║███████╗    ███████╗███████║██╔████╔██║██║   ██║   ██║         ▄███╔╝
// ██║███╗██║██╔══██║██║   ██║    ██║╚════██║    ╚════██║██╔══██║██║╚██╔╝██║██║   ██║   ██║         ▀▀══╝
// ╚███╔███╔╝██║  ██║╚██████╔╝    ██║███████║    ███████║██║  ██║██║ ╚═╝ ██║╚██████╔╝   ██║         ██╗
//  ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝     ╚═╝╚══════╝    ╚═▀▀▀══╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝    ╚═╝         ╚═╝

/**
 * @title Samot Staking
 * SamotStaking - a contract for the Samot NFT Staking
 */

abstract contract SamotToken {
    function claim(address _claimer, uint256 _reward) external {}

    function burn(address _from, uint256 _amount) external {}
}

abstract contract StakingV1 {
    function stakeOf(address _stakeholder)
        public
        view
        virtual
        returns (uint256[] memory);

    function stakeTimestampsOf(address _stakeholder)
        public
        view
        virtual
        returns (uint256[] memory);
}

abstract contract SamotNFT {
    function ownerOf(uint256 tokenId) public view virtual returns (address);

    function balanceOf(address owner)
        public
        view
        virtual
        returns (uint256 balance);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual;

    function isApprovedForAll(address owner, address operator)
        external
        view
        virtual
        returns (bool);
}

contract SamotStaking is Ownable, IERC721Receiver, ReentrancyGuard, Pausable {
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeMath for uint256;
    //addresses
    address public nftAddress;
    address public erc20Address;
    address public stakingV1Address;

    //uint256's
    //rate governs how often you receive your token
    uint256 public rate;
    uint256 public startBlock = 13606743;
    uint256 counter = 0;

    //smart contracts
    SamotToken token;
    SamotNFT nft;
    StakingV1 stakedV1;

    // mappings
    mapping(address => EnumerableSet.UintSet) private _deposits;
    mapping(address => mapping(uint256 => uint256)) public _depositBlocks;

    constructor(
        address _nftAddress,
        uint256 _rate,
        address _erc20Address,
        address _stakingV1Address
    ) {
        rate = _rate;
        nftAddress = _nftAddress;
        token = SamotToken(_erc20Address);
        nft = SamotNFT(_nftAddress);
        stakedV1 = StakingV1(_stakingV1Address);
        _pause();
    }

    // modifiers
    modifier onlyV1Stakers() {
        require(
            stakedV1.stakeOf(msg.sender).length > 0,
            "Only callable by V1 Staker"
        );
        _;
    }

    function setTokenContract(address _erc20Address) external onlyOwner {
        token = SamotToken(_erc20Address);
    }

    function setStakingV1Contract(address _stakingV1Address)
        external
        onlyOwner
    {
        stakedV1 = StakingV1(_stakingV1Address);
    }

    function setNFTContract(address _nftAddress) external onlyOwner {
        nft = SamotNFT(_nftAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /* STAKING MECHANICS */

    // Set a multiplier for how many tokens to earn each time a block passes.
    // 1 $AMOT PER DAY
    // n Blocks per day= 6200, Token Decimal = 18
    // Rate = 161290322600000
    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }

    //Checks staked amount
    function depositsOf(address account)
        external
        view
        returns (uint256[] memory)
    {
        EnumerableSet.UintSet storage depositSet = _deposits[account];
        uint256[] memory tokenIds = new uint256[](depositSet.length());

        for (uint256 i; i < depositSet.length(); i++) {
            tokenIds[i] = depositSet.at(i);
        }

        return tokenIds;
    }

    //Calculate rewards amount by address/tokenIds[]
    function calculateRewards(address account, uint256[] memory tokenIds)
        public
        view
        returns (uint256[] memory rewards)
    {
        rewards = new uint256[](tokenIds.length);

        for (uint256 i; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            rewards[i] =
                rate *
                (_deposits[account].contains(tokenId) ? 1 : 0) *
                (block.number - _depositBlocks[account][tokenId]);
        }

        return rewards;
    }

    //Reward amount by address/tokenId
    function calculateReward(address account, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        require(
            block.number > _depositBlocks[account][tokenId],
            "Invalid blocks"
        );
        return
            rate *
            (_deposits[account].contains(tokenId) ? 1 : 0) *
            (block.number - _depositBlocks[account][tokenId]);
    }

    //Returns the number of blocks that have passed since staking
    function calculateBlocks(address account, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return (block.number - _depositBlocks[account][tokenId]);
    }

    //reward claim function
    function claimRewards(uint256[] calldata tokenIds) public whenNotPaused {
        uint256 reward;
        uint256 blockCur = block.number;

        for (uint256 i; i < tokenIds.length; i++) {
            reward += calculateReward(msg.sender, tokenIds[i]);
            _depositBlocks[msg.sender][tokenIds[i]] = blockCur;
        }

        if (reward > 0) {
            token.claim(msg.sender, reward);
        }
    }

    //Staking function
    function stake(uint256[] calldata tokenIds) external whenNotPaused {
        require(msg.sender != nftAddress, "Invalid address");
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "This contract is not approved to transfer your NFT."
        );
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                nft.ownerOf(tokenIds[i]) == msg.sender,
                "You do not own this NFT."
            );
        }

        claimRewards(tokenIds);
        for (uint256 i; i < tokenIds.length; i++) {
            IERC721(nftAddress).safeTransferFrom(
                msg.sender,
                address(this),
                tokenIds[i],
                ""
            );
            _deposits[msg.sender].add(tokenIds[i]);
        }
    }

    //Unstaking function
    function unstake(uint256[] calldata tokenIds)
        external
        whenNotPaused
        nonReentrant
    {
        claimRewards(tokenIds);
        for (uint256 i; i < tokenIds.length; i++) {
            require(
                _deposits[msg.sender].contains(tokenIds[i]),
                "Staking: token not deposited"
            );
            _deposits[msg.sender].remove(tokenIds[i]);
            IERC721(nftAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokenIds[i],
                ""
            );
        }
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // Staking V1 mechanics
    function setStartBlock(uint256 _startBlock) public onlyOwner {
        startBlock = _startBlock;
    }

    function setCounter(uint256 _counter) public onlyOwner {
        counter = _counter;
    }

    function claimV1Rewards() external onlyV1Stakers whenNotPaused {
        uint256 rewardsV1 = calculateV1Rewards(msg.sender);
        uint256 blockCur = block.number;
        token.claim(msg.sender, rewardsV1);
        stakedV1.stakeTimestampsOf(msg.sender)[counter] = blockCur;
    }

    function calculateV1Rewards(address _account)
        public
        view
        returns (uint256 v1Rewards)
    {
        uint256 blockCur = block.number;
        return
            (rate *
                (blockCur - stakedV1.stakeTimestampsOf(msg.sender)[counter]))
                .mul((stakedV1.stakeOf(_account)).length);
    }
}