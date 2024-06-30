# Populate examples reads all the examples defined in ../example_pools.ts and deploys them as pools from the factory address

# Read the example pools from the JSON file
example_pools=$(cat ../example_pools.json)

# Extract the factory address from the deployment script
factory_address=$(sh scripts/deploy.sh | grep "Factory address" | awk '{print $NF}')

# Loop through each example pool and deploy it using starkli
echo "$example_pools" | jq -c '.[]' | while read -r pool; do
  title=$(echo "$pool" | jq -r '.title')
  wish=$(echo "$pool" | jq -r '.wish')
  success_criteria=$(echo "$pool" | jq -r '.success_criteria')
  recipients=$(echo "$pool" | jq -r '.recipients | join(",")')
  recipient_shares=$(echo "$pool" | jq -r '.recipient_shares | join(",")')
  oracle=$(echo "$pool" | jq -r '.oracle')
  fee_address=$(echo "$pool" | jq -r '.fee_address')
  collect_fee=$(echo "$pool" | jq -r '.collect_fee')
  categories=$(echo "$pool" | jq -r '.categories | join(",")')

  # Deploy the pool using starkli
  starkli invoke $factory_address target/dev/factory_abi.json --function deploy \
    --inputs "$title" "$wish" "$success_criteria" "$recipients" "$recipient_shares" "$oracle" "$fee_address" "$collect_fee" "$categories"
done

# Function which takes a string, converts it to a byte array and then segments it into 
