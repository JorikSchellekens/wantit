use starknet::{ContractAddress, ClassHash};
use array::ArrayTrait;

#[starknet::interface]
trait IFactory<TContractState> {
    fn get_class_hash(self: @TContractState) -> ClassHash;
    fn deploy(ref self: TContractState, title: ByteArray, wish: ByteArray, success_criteria: ByteArray, recipients: Array<ContractAddress>, recipient_shares: Array<u8>, oracle: ContractAddress, fee_address: ContractAddress, collect_fee: bool, categories: Array<felt252>) -> ContractAddress;
    fn get_all_contracts(self: @TContractState) -> Array<ContractAddress>;
    fn get_contract_count(self: @TContractState) -> u128;
    fn fee_address(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod ContractFactory{
    use core::starknet::event::EventEmitter;
    use core::serde::Serde;
    use starknet::{ContractAddress, ClassHash, get_caller_address, Zeroable};
    use starknet::syscalls::deploy_syscall;
    use dict::Felt252DictTrait;
    #[storage]
    struct Storage {
        classHash: ClassHash,
        contract_count: u128,
        contracts: LegacyMap<u128, ContractAddress>,
        fee_address: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        contractCreated: ContractCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct ContractCreated {
        #[key]
        by: ContractAddress,
        contractAddress: ContractAddress,
    }

    /// Constructor for the factory contract.
    /// Initializes the contract with a given class hash.
    #[constructor]
    fn constructor(ref self: ContractState, contractClassHash: ClassHash, fee_address: ContractAddress)  {
        self.classHash.write(contractClassHash);
        self.fee_address.write(fee_address);
    }

    /// Implementation of the IFactory interface for deploying contracts.
    /// This function takes various parameters describing the contract to be deployed and returns the address of the newly deployed contract.
    #[abi(embed_v0)]
    impl factoryImpl of super::IFactory<ContractState> {

        /// Reads the class hash of the contract.
        fn get_class_hash(self: @ContractState) -> ClassHash {
            self.classHash.read()
        }

        /// Deploys a new contract with the given parameters.
        fn deploy(
            ref self: ContractState,
            title: ByteArray, // The title of the event
            wish: ByteArray, // A short description of what is required to trigger the payout
            success_criteria: ByteArray, // The success criteria for the event which results in the payout
            recipients: Array<ContractAddress>, // The accounts which will be rewarded for the event occurring
            recipient_shares: Array<u8>, // The share of the total pool each recipient will receive
            oracle: ContractAddress, // The oracle which will trigger the payout
            fee_address: ContractAddress, // The address which will collect the fees
            collect_fee: bool, // Whether to collect a fee for deploying the contract
            categories: Array<felt252>, // The categories this event falls under
        ) -> ContractAddress {
            // Prepare constructor arguments for the new contract
            let mut constructor_calldata = ArrayTrait::new();
            title.serialize(ref constructor_calldata);
            wish.serialize(ref constructor_calldata);
            success_criteria.serialize(ref constructor_calldata);
            recipients.serialize(ref constructor_calldata);
            recipient_shares.serialize(ref constructor_calldata);
            oracle.serialize(ref constructor_calldata);
            fee_address.serialize(ref constructor_calldata);
            collect_fee.serialize(ref constructor_calldata);
            categories.serialize(ref constructor_calldata);

            // Deploy the contract using the prepared calldata
            let (deployed_address, _) = deploy_syscall(
                self.classHash.read(), 0, constructor_calldata.span(), false
            ).expect('Failed to deploy contract.');
            
            // Update storage to reflect the new contract deployment
            self.contract_count.write(self.contract_count.read() + 1);
            self.contracts.write(self.contract_count.read(), deployed_address);
            self.fee_address.write(fee_address);

            // Emit an event indicating the creation of the contract
            self.emit(ContractCreated{by: get_caller_address(), contractAddress: deployed_address});

            deployed_address
        }

        /// Retrieves all deployed contract addresses.
        fn get_all_contracts(self: @ContractState) -> Array<ContractAddress> {
            let mut contractsAddress = ArrayTrait::new();
            let mut i: u128 = 1;
            loop {
                if i > self.contract_count.read() {
                    break;
                }
                contractsAddress.append(self.contracts.read(i));
                i += 1;
            };
            contractsAddress
        }

        fn fee_address(self: @ContractState) -> ContractAddress {
            self.fee_address.read()
        }

        /// Returns the number of contracts deployed by this factory.
        fn get_contract_count(self: @ContractState) -> u128 {
            self.contract_count.read()
        }
    }
}