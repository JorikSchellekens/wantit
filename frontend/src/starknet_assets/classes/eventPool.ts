import { class_ } from "./types"

const POOL_ABI = [
  {
    "type": "impl",
    "name": "WantIMPL",
    "interface_name": "wantit::want::IWantIt"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "wantit::want::IWantIt",
    "items": [
      {
        "type": "function",
        "name": "payout",
        "inputs": [
          {
            "name": "token_addresses",
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "title",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "wish",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "success_criteria",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "oracle",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "recipients",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "recipient_shares",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<core::integer::u256>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "completed",
        "inputs": [],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "title",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "wish",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "success_criteria",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "recipients",
        "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
      },
      {
        "name": "recipient_shares",
        "type": "core::array::Array::<core::integer::u256>"
      },
      {
        "name": "oracle",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "wantit::want::WantPool::Event",
    "kind": "enum",
    "variants": []
  }
]

export const EVENT_POOL_CLASS : class_ = {
    classhash: "0x0437330ab9d9f443e2f7a069a3a5420b4c083f4ce2481608910794315c4f1abd",
    abi: POOL_ABI,
}