// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract FactoryScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy Want implementation
        Want wantImplementation = new Want();

        // Deploy WantFactory
        WantFactory factory = new WantFactory(address(wantImplementation));

        // Deploy a sample Want through the factory
        Want.Recipient[] memory recipients = new Want.Recipient[](1);
        recipients[0] = Want.Recipient(payable(address(0x1234)), 100);

        IERC20[] memory initialSupportedTokens = new IERC20[](0);

        address wantAddress = factory.createWant(
            "Sample Want",
            "I want something",
            "Success criteria",
            recipients,
            address(0x5678),  // oracle
            address(0x9ABC),  // feeAddress
            true,             // collectFee
            new string[](0),  // categories
            "https://example.com/metadata/{id}.json",  // uri
            initialSupportedTokens,
            block.timestamp + 30 days  // expiryTimestamp
        );

        console.log("Want implementation deployed at:", address(wantImplementation));
        console.log("WantFactory deployed at:", address(factory));
        console.log("Sample Want deployed at:", wantAddress);

        vm.stopBroadcast();
    }
}