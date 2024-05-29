use snforge_std::{ declare, ContractClassTrait };
use wantit::want::{IWantItDispatcher, IWantItDispatcherTrait};
use wantit::factory::{IFactoryDispatcher, IFactoryDispatcherTrait};
use core::serde::Serde;
use starknet::{ContractAddress, contract_address_const};

// Test that the factory deploys the contract correctly
#[test]
fn constructor_test() {
    // Deploy the factory with the class of the contract
    // Declare the factory
    let factory = declare("ContractFactory").unwrap();

    // Declare the implementation contract
    let implementation = declare("WantPool").unwrap();
    let mut factory_calldata = ArrayTrait::new();
    implementation.serialize(ref factory_calldata);

    // Deploy the factory
    let (factory_address, _) = factory.deploy(@factory_calldata).unwrap();
    let factory_dispatcher = IFactoryDispatcher { contract_address: factory_address };

    // Check that the contract was deployed correctly
    let title: ByteArray = "title";
    let wish: ByteArray = "description";
    let success_criteria: ByteArray = "success_criteria";
    let recipients: Array<ContractAddress> = array![contract_address_const::<0x1>(), contract_address_const::<0x2>(), contract_address_const::<0x3>()];
    let recipient_shares: Array<u8> = array![1, 1, 1];
    let oracle: ContractAddress = contract_address_const::<0x2>();

    // Call the factory to deploy the contract
    let contract_address = factory_dispatcher.deploy(
        title.clone(),
        wish.clone(),
        success_criteria.clone(),
        recipients.clone(),
        recipient_shares.clone(),
        oracle.clone()
    );

    let dispatcher = IWantItDispatcher { contract_address };

    // Test that the read functions work correctly
    // Call the title view function of the contract and assert its correctness
    assert(title == dispatcher.title(), 'title incorrect');

    // Call the wish view function of the contract and assert its correctness
    assert(wish == dispatcher.wish(), 'description incorect');

    // Call the oracle view function of the contract and assert its correctness
    assert(oracle == dispatcher.oracle(), 'oracle incorrect');

    // Call the recipients view function of the contract and assert its correctness
    assert(recipients == dispatcher.recipients(), 'recipients incorrect');

    // Call the recipient_shares view function of the contract and assert its correctness
    assert(recipient_shares == dispatcher.recipient_shares(), 'recipient_shares incorrect');
}
