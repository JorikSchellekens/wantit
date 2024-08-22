// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./want.sol";

contract WantFactory {
    address public immutable implementationContract;
    uint256 public currentSalt;

    event WantCreated(address indexed wantAddress, uint256 salt);

    constructor(address _implementationContract) {
        implementationContract = _implementationContract;
    }

    function createWant(
        string memory _title,
        string memory _wish,
        string memory _successCriteria,
        Want.Recipient[] memory _recipients,
        address _oracle,
        address _feeAddress,
        bool _collectFee,
        string[] memory _categories,
        string memory _uri,
        IERC20[] memory _initialSupportedTokens,
        uint256 _expiryTimestamp
    ) external returns (address) {
        bytes32 salt = bytes32(currentSalt);
        address wantAddress = Clones.cloneDeterministic(implementationContract, salt);

        Want(wantAddress).initialize(
            _title,
            _wish,
            _successCriteria,
            _recipients,
            _oracle,
            _feeAddress,
            _collectFee,
            _categories,
            _uri,
            _initialSupportedTokens,
            _expiryTimestamp
        );

        emit WantCreated(wantAddress, currentSalt);

        currentSalt++;
        return wantAddress;
    }

    function predictWantAddress(uint256 _salt) public view returns (address) {
        return Clones.predictDeterministicAddress(
            implementationContract,
            bytes32(_salt),
            address(this)
        );
    }

    function getDeployedWants(uint256 startSalt, uint256 endSalt) public view returns (address[] memory) {
        require(endSalt >= startSalt, "Invalid salt range");
        require(endSalt <= currentSalt, "End salt out of range");

        address[] memory deployedWants = new address[](endSalt - startSalt);
        for (uint256 i = startSalt; i < endSalt;) {
            deployedWants[i - startSalt] = predictWantAddress(i);
            unchecked { ++i; }
        }

        return deployedWants;
    }

    function getAllDeployedWants() external view returns (address[] memory) {
        return getDeployedWants(0, currentSalt);
    }

}