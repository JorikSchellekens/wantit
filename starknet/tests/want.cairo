use snforge_std::{ declare, ContractClassTrait, start_cheat_caller_address, stop_cheat_caller_address };
use wantit::want::{IWantItDispatcher, IWantItDispatcherTrait};
use core::serde::Serde;
use starknet::{ContractAddress, contract_address_const};
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

#[test]
fn want_pool_basic_deployment() {
    let title: ByteArray = "title";
    let wish: ByteArray = "description";
    let success_criteria: ByteArray = "success_criteria";
    let recipients: Array<ContractAddress> = array![contract_address_const::<0x1>(), contract_address_const::<0x2>(), contract_address_const::<0x3>()];
    let recipient_shares: Array<u8> = array![1, 1, 1];
    let oracle: ContractAddress = contract_address_const::<0x2>();

    let fee_address: ContractAddress = contract_address_const::<'fee collector'>();
    let collect_fee: bool = true;
    let categories: Array<felt252> = array!['sports', 'boxing', 'xxx'];

    // Deploy the contract
    let dispatcher = deploy_want_pool(
        title.clone(),
        wish.clone(),
        success_criteria.clone(),
        recipients.clone(),
        recipient_shares.clone(),
        oracle,
        fee_address,
        collect_fee,
        categories.clone()
    );

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

    // Call the fee_address view function of the contract and assert its correctness
    assert(fee_address == dispatcher.fee_address(), 'fee_address incorrect');

    // Call the collect_fee view function of the contract and assert its correctness
    assert(collect_fee == dispatcher.collect_fee(), 'collect_fee incorrect');

    // Call the categories view function of the contract and assert its correctness
    assert(categories == dispatcher.categories(), 'categories incorrect');
}

fn deploy_want_pool(title: ByteArray, wish: ByteArray, success_criteria: ByteArray, recipients: Array<ContractAddress>, recipient_shares: Array<u8>, oracle: ContractAddress, fee_address: ContractAddress, collect_fee: bool, categories: Array<felt252>) -> IWantItDispatcher {
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

    let contract = declare("WantPool").unwrap();
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    IWantItDispatcher { contract_address }
}

// Deploys an erc20 contract
fn deploy_erc20(initial_supply: u256, recipient: ContractAddress) -> IERC20Dispatcher {
    let mut calldata = ArrayTrait::new();
    initial_supply.serialize(ref calldata);
    recipient.serialize(ref calldata);

    let contract = declare("TestToken").unwrap();
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    IERC20Dispatcher { contract_address }
}

// Test that the contract can distribute tokens to the recipients correctly
#[test]
fn distribute_test_with_fee() {
    let title: ByteArray = "title";
    let wish: ByteArray = "description";
    let success_criteria: ByteArray = "success_criteria";
    let recipients: Array<ContractAddress> = array![contract_address_const::<0x1>(), contract_address_const::<0x2>(), contract_address_const::<0x3>()];
    let recipient_shares: Array<u8> = array![1, 1, 1];
    let oracle: ContractAddress = contract_address_const::<0x1>();
    let fee_address: ContractAddress = contract_address_const::<'fee collector'>();
    let collect_fee: bool = true;
    let categories: Array<felt252> = array!['sports', 'boxing', 'xxx'];

    // Deploy an ERC20 token contract
    let recipient = contract_address_const::<0x1>();
    let initial_supply = 1000;
    let erc20_dispatcher = deploy_erc20(initial_supply, recipient);

    // Deploy the contract
    let dispatcher = deploy_want_pool(title.clone(), wish.clone(), success_criteria.clone(), recipients.clone(), recipient_shares.clone(), oracle, fee_address, collect_fee, categories);

    // Distribute ERC20 tokens to the WantPool contract
    start_cheat_caller_address(erc20_dispatcher.contract_address, 0x1.try_into().unwrap());
    erc20_dispatcher.transfer(dispatcher.contract_address, 1000);
    stop_cheat_caller_address(erc20_dispatcher.contract_address);

    // Quick sanity check
    let balance_recipient = erc20_dispatcher.balance_of(recipient);
    assert(balance_recipient == 0, 'Balance of recipient incorrect');
    let balance_dispatcher = erc20_dispatcher.balance_of(dispatcher.contract_address);
    assert(balance_dispatcher == 1000, 'Balance of dispatcher incorrect');

    start_cheat_caller_address(dispatcher.contract_address, 0x1.try_into().unwrap());
    dispatcher.payout(array![erc20_dispatcher.contract_address]);
    stop_cheat_caller_address(dispatcher.contract_address);

    let balance_recipient1 = erc20_dispatcher.balance_of(0x1.try_into().unwrap());
    let balance_recipient2 = erc20_dispatcher.balance_of(0x2.try_into().unwrap());
    let balance_recipient3 = erc20_dispatcher.balance_of(0x3.try_into().unwrap());
    assert(balance_recipient1 == 330, 'balance1 incorrect');
    assert(balance_recipient2 == 330, 'balance2 incorrect');
    assert(balance_recipient3 == 330, 'balance3 incorrect');


    // Check that the fee has been collected
    let balance_fee = erc20_dispatcher.balance_of(fee_address);
    assert(balance_fee == 10, 'Fee balance incorrect');

    // Check that the contract has been marked as completed
    assert(dispatcher.completed(), 'Contract not completed');
}

#[test]
fn distribute_test_without_fee() {
    let title: ByteArray = "title";
    let wish: ByteArray = "description";
    let success_criteria: ByteArray = "success_criteria";
    let recipients: Array<ContractAddress> = array![contract_address_const::<0x1>(), contract_address_const::<0x2>(), contract_address_const::<0x3>()];
    let recipient_shares: Array<u8> = array![1, 1, 1];
    let oracle: ContractAddress = contract_address_const::<0x1>();
    let fee_address: ContractAddress = contract_address_const::<'fee collector'>();
    let collect_fee: bool = false;
    let categories: Array<felt252> = array!['sports', 'boxing', 'xxx'];

    // Deploy an ERC20 token contract
    let recipient = contract_address_const::<0x1>();
    let initial_supply = 1000;
    let erc20_dispatcher = deploy_erc20(initial_supply, recipient);

    // Deploy the contract
    let dispatcher = deploy_want_pool(title.clone(), wish.clone(), success_criteria.clone(), recipients.clone(), recipient_shares.clone(), oracle, fee_address, collect_fee, categories);

    // Distribute ERC20 tokens to the WantPool contract
    start_cheat_caller_address(erc20_dispatcher.contract_address, 0x1.try_into().unwrap());
    erc20_dispatcher.transfer(dispatcher.contract_address, 1000);
    stop_cheat_caller_address(erc20_dispatcher.contract_address);

    // Quick sanity check
    let balance_recipient = erc20_dispatcher.balance_of(recipient);
    assert(balance_recipient == 0, 'Balance of recipient incorrect');
    let balance_dispatcher = erc20_dispatcher.balance_of(dispatcher.contract_address);
    assert(balance_dispatcher == 1000, 'Balance of dispatcher incorrect');

    start_cheat_caller_address(dispatcher.contract_address, 0x1.try_into().unwrap());
    dispatcher.payout(array![erc20_dispatcher.contract_address]);
    stop_cheat_caller_address(dispatcher.contract_address);

    let balance_recipient1 = erc20_dispatcher.balance_of(0x1.try_into().unwrap());
    let balance_recipient2 = erc20_dispatcher.balance_of(0x2.try_into().unwrap());
    let balance_recipient3 = erc20_dispatcher.balance_of(0x3.try_into().unwrap());
    assert(balance_recipient1 == 333, 'balance1 incorrect');
    assert(balance_recipient2 == 333, 'balance2 incorrect');
    assert(balance_recipient3 == 333, 'balance3 incorrect');

    // Check that the fee has been collected
    let balance_fee = erc20_dispatcher.balance_of(fee_address);
    assert(balance_fee == 0, 'Fee balance incorrect');

    // Check that the contract has been marked as completed
    assert(dispatcher.completed(), 'Contract not completed');
}