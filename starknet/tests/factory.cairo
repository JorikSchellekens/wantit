use snforge_std::{ declare, ContractClassTrait };
use wantit::want::{IWantItDispatcher, IWantItDispatcherTrait};
use wantit::factory::{IFactoryDispatcher, IFactoryDispatcherTrait};
use core::serde::Serde;
use starknet::{ContractAddress, contract_address_const};

// Test that the factory deploys the contract correctly
#[test]
fn factory_test() {
    let fee_address: ContractAddress = contract_address_const::<'fee collector'>();

    // Deploy the factory with the class of the contract
    // Declare the factory
    let factory = declare("ContractFactory").unwrap();

    // Declare the implementation contract
    let implementation = declare("WantPool").unwrap();
    let mut factory_calldata = ArrayTrait::new();
    implementation.serialize(ref factory_calldata);
    fee_address.serialize(ref factory_calldata);

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
    let collect_fee: bool = true;
    let categories: Array<felt252> = array!['sports', 'boxing', 'xxx'];


    // Call the factory to deploy the contract
    let contract_address = factory_dispatcher.deploy(
        title.clone(),
        wish.clone(),
        success_criteria.clone(),
        recipients.clone(),
        recipient_shares.clone(),
        oracle.clone(),
        fee_address.clone(),
        collect_fee,
        categories.clone()
    );

    let dispatcher = IWantItDispatcher { contract_address };

    // Test that the read functions work correctly
    // Call the title view function of the contract and assert its correctness
    assert(title == dispatcher.title(), 'title incorrect');

    // Call the wish view function of the contract and assert its correctness
    assert(wish == dispatcher.wish(), 'description incorrect');

    // Call the oracle view function of the contract and assert its correctness
    assert(oracle == dispatcher.oracle(), 'oracle incorrect');

    // Call the recipients view function of the contract and assert its correctness
    assert(recipients == dispatcher.recipients(), 'recipients incorrect');

    // Call the recipient_shares view function of the contract and assert its correctness
    assert(recipient_shares == dispatcher.recipient_shares(), 'recipient_shares incorrect');

    // Call the fee_address view function of the contract and assert its correctness
    assert(fee_address == dispatcher.fee_address(), 'collection add incorrect');

    // Call the collect_fee view function of the contract and assert its correctness
    assert(collect_fee == dispatcher.collect_fee(), 'collect_fee incorrect');

    // Call the categories view function of the contract and assert its correctness
    assert(categories == dispatcher.categories(), 'categories incorrect');
}
