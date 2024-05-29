use starknet::ContractAddress;
use starknet::Felt252TryIntoContractAddress;

#[starknet::interface]
trait IWantIt<TContractState> {
    fn payout(ref self: TContractState, token_addresses: Array<ContractAddress>);
    // Get the title of the event
    fn title(self: @TContractState) -> ByteArray;
    // Get the wish of the event
    fn wish(self: @TContractState) -> ByteArray;
    // Get the success criteria of the event
    fn success_criteria(self: @TContractState) -> ByteArray;
    // Get the oracle of the event
    fn oracle(self: @TContractState) -> ContractAddress;
    // Get the recipients of the event
    fn recipients(self: @TContractState) -> Array<ContractAddress>;
    // Get the shares of the recipients of the event
    fn recipient_shares(self: @TContractState) -> Array<u8>;
    // Get the completion status of the event
    fn completed(self: @TContractState) -> bool;
    // This function 'should' return the funds in the pool to the
    // participants. However, this is likely much too expensive
    // due to the storage costs of all the participant addresses.
    // Instead I suggest hardcoding a 'stale' handler address
    // which is managed by the foundation behind wantit
    // who's responsibility it is to collect via indexing
    // all transfers that have gone into this pool and
    // publishing this list publicly before redistributing
    // the funds to the participants in this list.
    // State proofs may be cheap enough to do this in future.
    // fn stale(self: @TContractState);
}

#[starknet::contract]
mod WantPool {
  use core::result::ResultTrait;
  use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
  use starknet::{get_contract_address, get_caller_address, ContractAddress};
  use alexandria_storage::list::{List, ListTrait};

  #[derive(Drop, Clone, Serde, Store)]
  struct Recipient {
    address: ContractAddress,
    shares: u8,
  }

  #[storage]
  struct Storage {
    wish: ByteArray,
    title: ByteArray,
    success_criteria: ByteArray,
    oracle: ContractAddress,
    recipients: List<ContractAddress>,
    // The sum of all shares cannot exceed 2^256
    recipient_shares: List<u8>,
    // TODO: remove this and replace with an indexing solution
    // Type: (UserAddress, TokenAddress) -> u256
    participation_tracker: LegacyMap<(ContractAddress, ContractAddress), u256>,
    // Whether the event has been completed
    completed: bool,
  }

  #[constructor]
  fn constructor(
    ref self: ContractState,
    // The title of the event
    title: ByteArray,
    // A short description of what is required to trigger the payout
    wish: ByteArray,
    // The success criteria for the event which results in the payout
    success_criteria: ByteArray,
    // The accounts which will be rewarded for the event occuring
    recipients: Array<ContractAddress>,
    // The share of the total pool each recipient will receive
    recipient_shares: Array<u8>,
    // The oracle which will trigger the payout
    oracle: ContractAddress,
  ) {
    self.title.write(title);
    self.wish.write(wish);
    let mut recipients_list = self.recipients.read();
    let _ = recipients_list.append_span(recipients.span());
    let mut recipient_shares_list = self.recipient_shares.read();
    let _ = recipient_shares_list.append_span(recipient_shares.span());
    self.oracle.write(oracle);
  }

  #[abi(embed_v0)]
  impl WantIMPL of super::IWantIt<ContractState> {

    fn title(self: @ContractState) -> ByteArray {
      return self.title.read();
    }

    fn wish(self: @ContractState) -> ByteArray {
      return self.wish.read();
    }

    fn success_criteria(self: @ContractState) -> ByteArray {
      return self.success_criteria.read();
    }

    fn completed(self: @ContractState) -> bool {
      return self.completed.read();
    }

    fn oracle(self: @ContractState) -> ContractAddress {
      return self.oracle.read();
    }

    fn recipients(self: @ContractState) -> Array<ContractAddress> {
      return self.recipients.read().array().unwrap();
    }

    fn recipient_shares(self: @ContractState) -> Array<u8> {
      return self.recipient_shares.read().array().unwrap();
    }

    fn payout(ref self: ContractState, token_addresses: Array<ContractAddress>) {
      let caller = get_caller_address();
      let oracle = self.oracle.read();
      let this = get_contract_address();

      assert(caller == oracle, 'Only oracle can trigger payout');

      // We will compute the total number of proportional shares
      let recipient_shares = @self.recipient_shares.read();
      let recipients = @self.recipients.read();

      let mut i = 0;
      let mut total_shares: u256 = 0;
      loop {
        if i == recipient_shares.len() {
          break;
        }
        total_shares += recipient_shares[i].try_into().unwrap();
        i += 1;
      };

      // Similar to below but we loop through tokens first and then recipients
      let mut i = 0;
      loop {
        if i == token_addresses.len() {
          break;
        }
        let token_address = *token_addresses.at(i);
        let total_amount = IERC20Dispatcher{ contract_address: token_address }.balance_of(this);
        let mut j = 0;
        loop {
          if j == recipient_shares.len() {
            break;
          }
          let recipient_share: u256 = recipient_shares[j].try_into().unwrap();
          let amount = (total_amount * recipient_share) / total_shares;
          IERC20Dispatcher{ contract_address: token_address }.transfer(recipients[j], amount);
          j += 1;
        };
        i += 1;
      };

      self.completed.write(true);
    }
  }
}
