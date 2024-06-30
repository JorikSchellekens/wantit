// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiTokenWantPool is ERC1155, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    struct Recipient {
        address addr;
        uint8 shares;
    }

    struct TokenInfo {
        IERC20 token;
        uint256 totalContributions;
        uint256 nftId;
    }

    Counters.Counter private _tokenIds;
    uint256 public constant WANT_TOKEN_ID = 0;

    string public immutable title;
    string public immutable wish;
    string public immutable successCriteria;
    address public immutable oracle;
    Recipient[] public immutable recipients;
    address public immutable feeAddress;
    bool public immutable collectFee;
    string[] public immutable categories;
    uint256 public immutable expiryTimestamp;

    mapping(IERC20 => TokenInfo) public tokenInfos;
    IERC20[] public supportedTokens;

    bool public completed;
    bool public expired;

    event Contribution(address indexed contributor, address indexed token, uint256 amount, uint256 tokenId);
    event Payout(address[] tokens, uint256[] amounts);
    event RewardClaimed(address indexed claimer, address indexed token, uint256 amount);
    event TokenAdded(address indexed token, uint256 tokenId);
    event WantExpired();
    event ContributionReturned(address indexed contributor, address indexed token, uint256 amount);

    constructor(
        string memory _title,
        string memory _wish,
        string memory _successCriteria,
        address[] memory _recipientAddresses,
        uint8[] memory _recipientShares,
        address _oracle,
        address _feeAddress,
        bool _collectFee,
        string[] memory _categories,
        string memory _uri,
        IERC20[] memory _initialSupportedTokens,
        uint256 _expiryTimestamp
    ) ERC1155(_uri) {
        require(_recipientAddresses.length == _recipientShares.length, "Recipients and shares must match");
        require(_expiryTimestamp > block.timestamp, "Expiry must be in the future");

        title = _title;
        wish = _wish;
        successCriteria = _successCriteria;
        oracle = _oracle;
        feeAddress = _feeAddress;
        collectFee = _collectFee;
        categories = _categories;
        expiryTimestamp = _expiryTimestamp;

        // Initialize recipients array
        for (uint i = 0; i < _recipientAddresses.length; i++) {
            recipients.push(Recipient(_recipientAddresses[i], _recipientShares[i]));
        }

        // Mint a single "Want" NFT
        _mint(address(this), WANT_TOKEN_ID, 1, "");

        // Add initial supported tokens
        for (uint i = 0; i < _initialSupportedTokens.length; i++) {
            _addSupportedToken(_initialSupportedTokens[i]);
        }
    }

    function _addSupportedToken(IERC20 token) internal {
        require(address(tokenInfos[token].token) == address(0), "Token already supported");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        tokenInfos[token] = TokenInfo({
            token: token,
            totalContributions: 0,
            nftId: newTokenId
        });
        
        supportedTokens.push(token);
        
        emit TokenAdded(address(token), newTokenId);
    }

    function contribute(IERC20 token, uint256 amount) external nonReentrant {
        require(!completed, "Want has been completed");
        require(!expired, "Want has expired");
        require(block.timestamp < expiryTimestamp, "Want has expired");
        require(amount > 0, "Contribution must be greater than 0");

        if (address(tokenInfos[token].token) == address(0)) {
            _addSupportedToken(token);
        }

        TokenInfo storage tokenInfo = tokenInfos[token];
        
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        tokenInfo.totalContributions = tokenInfo.totalContributions.add(amount);

        // Mint contribution NFT
        _mint(msg.sender, tokenInfo.nftId, amount, "");

        emit Contribution(msg.sender, address(token), amount, tokenInfo.nftId);
    }

    function payout() external nonReentrant {
        require(msg.sender == oracle, "Only oracle can trigger payout");
        require(!completed, "Payout already completed");
        require(!expired, "Want has expired");
        require(block.timestamp < expiryTimestamp, "Want has expired");

        uint256 totalShares = 0;
        for (uint i = 0; i < recipients.length; i++) {
            totalShares = totalShares.add(recipients[i].shares);
        }

        address[] memory tokenAddresses = new address[](supportedTokens.length);
        uint256[] memory payoutAmounts = new uint256[](supportedTokens.length);

        for (uint i = 0; i < supportedTokens.length; i++) {
            IERC20 token = supportedTokens[i];
            uint256 totalAmount = token.balanceOf(address(this));

            if (collectFee) {
                uint256 fee = totalAmount.div(100);
                require(token.transfer(feeAddress, fee), "Fee transfer failed");
                totalAmount = totalAmount.sub(fee);
            }

            for (uint j = 0; j < recipients.length; j++) {
                uint256 amount = totalAmount.mul(recipients[j].shares).div(totalShares);
                require(token.transfer(recipients[j].addr, amount), "Recipient transfer failed");
                payoutAmounts[i] = payoutAmounts[i].add(amount);
            }

            tokenAddresses[i] = address(token);
        }

        completed = true;
        emit Payout(tokenAddresses, payoutAmounts);
    }

    function claimContribution(IERC20 token) external nonReentrant {
        require(!completed, "Want has been completed");
        require(block.timestamp >= expiryTimestamp, "Want has not expired yet");
        require(address(tokenInfos[token].token) != address(0), "Token not supported");

        if (!expired) {
            expired = true;
            emit WantExpired();
        }

        TokenInfo storage tokenInfo = tokenInfos[token];
        uint256 contributionAmount = balanceOf(msg.sender, tokenInfo.nftId);
        require(contributionAmount > 0, "No contribution found");

        // Burn the contribution NFT
        _burn(msg.sender, tokenInfo.nftId, contributionAmount);

        // Transfer the contribution back to the user
        require(token.transfer(msg.sender, contributionAmount), "Contribution return failed");

        emit ContributionReturned(msg.sender, address(token), contributionAmount);
    }

    function getContributionNFT(address contributor, IERC20 token) external view returns (uint256, uint256) {
        require(address(tokenInfos[token].token) != address(0), "Token not supported");
        TokenInfo storage tokenInfo = tokenInfos[token];
        return (tokenInfo.nftId, balanceOf(contributor, tokenInfo.nftId));
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= _tokenIds.current(), "URI query for nonexistent token");
        // Return a URI that includes the token ID and contribution amount
        // You would need to implement a proper metadata server to handle these URIs
        return string(abi.encodePacked(super.uri(tokenId), "/", _uint2str(tokenId)));
    }

    function _uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    function getRecipients() external view returns (Recipient[] memory) {
        return recipients;
    }

    function getCategories() external view returns (string[] memory) {
        return categories;
    }
}