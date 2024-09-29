// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract FactoryScript is Script {
    function run() external returns (address, address) {
        vm.startBroadcast();

        // Deploy Want implementation
        Want wantImplementation = new Want();

        // Deploy WantFactory
        WantFactory factory = new WantFactory(address(wantImplementation));

        vm.stopBroadcast();

        // Log the factory address
        console.log("Want Implementation deployed at:", address(wantImplementation));
        console.log("WantFactory deployed at:", address(factory));

        return (address(factory), address(wantImplementation));
    }
}