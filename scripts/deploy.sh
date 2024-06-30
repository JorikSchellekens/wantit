output=$(starkli declare target/dev/wantit_contractFactory.contract_class.json)
factory_class_hash=$(echo "$output" | tail -n 1)
echo "Factory class hash: $factory_class_hash"

output=$(starkli declare target/dev/wantit_WantPool.contract_class.json)
pool_class_hash=$(echo "$output" | tail -n 1)
echo "Pool class hash: $pool_class_hash"

starknet_account_path=$STARKNET_ACCOUNT
account_address=$(jq -r '.deployment.address' "$starknet_account_path")
echo "Fee collecting address: $account_address"

output=$(starkli deploy $factory_class_hash $pool_class_hash $account_address)
factory_address=$(echo "$output" | tail -n 1)
echo "Factory address: $factory_address"
