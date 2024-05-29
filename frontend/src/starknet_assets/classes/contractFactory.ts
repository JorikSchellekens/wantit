import { class_ } from "./types";

const FACTORY_ABI = [
  {
    "type": "impl",
    "name": "factoryImpl",
    "interface_name": "wantit::factory::IFactory"
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
    "type": "interface",
    "name": "wantit::factory::IFactory",
    "items": [
      {
        "type": "function",
        "name": "get_class_hash",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "deploy",
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
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_all_contracts",
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
        "name": "get_contract_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u128"
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
        "name": "contractClassHash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "type": "event",
    "name": "wantit::factory::contractFactory::ContractCreated",
    "kind": "struct",
    "members": [
      {
        "name": "by",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "contractAddress",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "wantit::factory::contractFactory::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "contractCreated",
        "type": "wantit::factory::contractFactory::ContractCreated",
        "kind": "nested"
      }
    ]
  }
];

export const CONTRACT_FACTORY_CLASS : class_ = {
    classhash: "0x05d5726fe336a6e80b3c116aa3c946dc34da95aefae0617c5212079afbfc027b",
    abi: FACTORY_ABI
};

