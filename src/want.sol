// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract Want is Initializable, ERC1155Upgradeable, ReentrancyGuardUpgradeable, IERC1155Receiver {
    struct Recipient {
        address addr;
        uint8 shares;
    }

    struct TokenInfo {
        uint256 totalContributions;
        uint256 nftId;
    }

    enum Status {
        PENDING,
        EXPIRED,
        PASSED
    }

    uint256 private _tokenIds;
    uint256 public constant WANT_TOKEN_ID = 0;

    bytes32 public title;
    bytes32 public wish;
    bytes32 public successCriteria;
    address public oracle;
    address public feeAddress;
    bool public collectFee;
    uint256 public expiryTimestamp;
    Status public status;

    Recipient[] public recipients;
    string[] public categories;

    mapping(IERC20 => TokenInfo) public tokenInfos;
    IERC20[] public supportedTokens;

    event Contribution(address indexed contributor, address indexed token, uint256 amount, uint256 tokenId);
    event Payout(address[] tokens, uint256[] amounts);
    event RewardClaimed(address indexed claimer, address indexed token, uint256 amount);
    event TokenAdded(address indexed token, uint256 tokenId);
    event WantExpired();
    event ContributionReturned(address indexed contributor, address indexed token, uint256 amount);

    function initialize(
    string memory _title,
    string memory _wish,
    string memory _successCriteria,
    Recipient[] memory _recipients,
    address _oracle,
    address _feeAddress,
    bool _collectFee,
    string[] memory _categories,
    string memory _uri,
    IERC20[] memory _initialSupportedTokens,
    uint256 _expiryTimestamp
) external initializer {
    require(_expiryTimestamp > block.timestamp, "Expiry must be in the future");

    __ERC1155_init(_uri);
    __ReentrancyGuard_init();

    title = bytes32(bytes(_title));
    wish = bytes32(bytes(_wish));
    successCriteria = bytes32(bytes(_successCriteria));
    oracle = _oracle;
    feeAddress = _feeAddress;
    collectFee = _collectFee;
    expiryTimestamp = _expiryTimestamp;

    recipients = _recipients;
    categories = _categories;
    
    status = Status.PENDING;

    _mint(address(this), WANT_TOKEN_ID, 1, "");

    uint256 tokenLength = _initialSupportedTokens.length;
    for (uint256 i = 0; i < tokenLength;) {
        _addSupportedToken(_initialSupportedTokens[i]);
        unchecked { ++i; }
    }
}

    function _addSupportedToken(IERC20 token) internal {
        require(tokenInfos[token].nftId != 0, "Token already supported");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        tokenInfos[token] = TokenInfo({
            totalContributions: 0,
            nftId: newTokenId
        });
        
        supportedTokens.push(token);
        
        emit TokenAdded(address(token), newTokenId);
    }

    function contribute(IERC20 token, uint256 amount) external nonReentrant {
        require(amount > 0, "Contribution must be greater than 0");
        require(block.timestamp < expiryTimestamp, "Want has expired");
        require(status == Status.PENDING, "Want has been granted");

        // if (tokenInfos[token].nftId == 0) {
        //     _addSupportedToken(token);
        // }

        TokenInfo storage tokenInfo = tokenInfos[token];
        
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        tokenInfo.totalContributions += amount;

        // Mint contribution NFT
        _mint(msg.sender, tokenInfo.nftId, amount, "");

        emit Contribution(msg.sender, address(token), amount, tokenInfo.nftId);
    }

    function wantGranted() external {
        require(msg.sender == oracle, "Only oracle can grant want");
        require(status == Status.PENDING, "Want has already been granted");
        require(block.timestamp < expiryTimestamp, "Want has expired");

        status = Status.PASSED;
    }

    function payout(address[] calldata tokenAddresses) external nonReentrant {
        require(status == Status.PASSED, "Want has not been granted");

        uint256 totalShares = 0;
        for (uint i = 0; i < recipients.length; i++) {
            totalShares += recipients[i].shares;
        }

        uint256[] memory payoutAmounts = new uint256[](tokenAddresses.length);

        for (uint i = 0; i < tokenAddresses.length; i++) {
            IERC20 token = IERC20(tokenAddresses[i]);
            if (tokenInfos[token].nftId == 0) {
                continue; // Skip unsupported tokens
            }

            uint256 totalAmount = token.balanceOf(address(this));

            if (collectFee) {
                uint256 fee = totalAmount / 100;
                require(token.transfer(feeAddress, fee), "Fee transfer failed");
                totalAmount -= fee;
            }

            for (uint j = 0; j < recipients.length; j++) {
                uint256 amount = totalAmount * recipients[j].shares / totalShares;
                require(token.transfer(recipients[j].addr, amount), "Recipient transfer failed");
                payoutAmounts[i] += amount;
            }
        }

        emit Payout(tokenAddresses, payoutAmounts);
    }

    function claimContribution(IERC20 token) external nonReentrant {
        require(block.timestamp >= expiryTimestamp, "Want has not expired yet");
        require(status != Status.PASSED, "Want has not been granted");
        require(tokenInfos[token].nftId != 0, "Token not supported");

        status = Status.EXPIRED;
        emit WantExpired();

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
        require(tokenInfos[token].nftId != 0, "Token not supported");
        TokenInfo storage tokenInfo = tokenInfos[token];
        return (tokenInfo.nftId, balanceOf(contributor, tokenInfo.nftId));
    }

    function buildMetadataURI(uint256 tokenId) public view returns (string memory) {
        return string(
            abi.encodePacked(
                '{"name":"', title,
                '", "description":"', wish,
                '", "image":"', ">>>>>>TODO<<<<<<<",
                '", "attributes":', "[",
                    (tokenId == 0) ? "" :
                    '{"trait_type":"token", "value":"', _uint2str(uint256(uint160(address(supportedTokens[tokenId - 1])))), '"}'
                    '{"trait_type":"expiry", "value":"', _uint2str(expiryTimestamp), '"}'
                    '{"trait_type":"status", "value":"', status, '"}'
                    '{"trait_type":"oracle", "value":"', oracle, '"}'
                    '{"trait_type":"successCriteria", "value":"', successCriteria, '"}'
                    ']'
                '}'
            )
        );
    } 

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= _tokenIds, "URI query for nonexistent token");
        // Return a URI that includes the token ID and contribution amount
        // You would need to implement a proper metadata server to handle these URIs
        return buildMetadataURI(tokenId);
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

    // Implement the onERC1155Received function
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        // Add your custom logic here if needed

        // Return the magic value to indicate successful receipt
        return this.onERC1155Received.selector;
    }

    // Implement the onERC1155BatchReceived function if needed
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        // Add your custom logic here if needed

        // Return the magic value to indicate successful receipt
        return this.onERC1155BatchReceived.selector;
    }
}