export const WANT_FACTORY_ADDRESS = '0xC6c1439e3915681D4E7472839e3A3fcb5b256968' // Replace with the actual contract address

export const WANT_FACTORY_ABI = [
  {"type":"constructor","inputs":[{"name":"_implementationContract","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"createWant","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_wish","type":"string","internalType":"string"},{"name":"_successCriteria","type":"string","internalType":"string"},{"name":"_recipients","type":"tuple[]","internalType":"struct Want.Recipient[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"shares","type":"uint8","internalType":"uint8"}]},{"name":"_oracle","type":"address","internalType":"address"},{"name":"_feeAddress","type":"address","internalType":"address"},{"name":"_collectFee","type":"bool","internalType":"bool"},{"name":"_categories","type":"string[]","internalType":"string[]"},{"name":"_uri","type":"string","internalType":"string"},{"name":"_initialSupportedTokens","type":"address[]","internalType":"contract IERC20[]"},{"name":"_expiryTimestamp","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"currentSalt","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getAllDeployedWants","inputs":[],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"getDeployedWants","inputs":[{"name":"startSalt","type":"uint256","internalType":"uint256"},{"name":"endSalt","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"getDeployedWantsFrom","inputs":[{"name":"startSalt","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"implementationContract","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"predictWantAddress","inputs":[{"name":"_salt","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"event","name":"WantCreated","inputs":[{"name":"wantAddress","type":"address","indexed":true,"internalType":"address"},{"name":"salt","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ERC1167FailedCreateClone","inputs":[]}
] as const;

export const WANT_ABI = [
   {"type":"function","name":"WANT_TOKEN_ID","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"balanceOfBatch","inputs":[{"name":"accounts","type":"address[]","internalType":"address[]"},{"name":"ids","type":"uint256[]","internalType":"uint256[]"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"buildMetadataURI","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"categories","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"claimContribution","inputs":[{"name":"token","type":"address","internalType":"contract IERC20"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"collectFee","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"contribute","inputs":[{"name":"token","type":"address","internalType":"contract IERC20"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"expiryTimestamp","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"feeAddress","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getCategories","inputs":[],"outputs":[{"name":"","type":"string[]","internalType":"string[]"}],"stateMutability":"view"},{"type":"function","name":"getContributionNFT","inputs":[{"name":"contributor","type":"address","internalType":"address"},{"name":"token","type":"address","internalType":"contract IERC20"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getRecipients","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Want.Recipient[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"shares","type":"uint8","internalType":"uint8"}]}],"stateMutability":"view"},{"type":"function","name":"initialize","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_wish","type":"string","internalType":"string"},{"name":"_successCriteria","type":"string","internalType":"string"},{"name":"_recipients","type":"tuple[]","internalType":"struct Want.Recipient[]","components":[{"name":"addr","type":"address","internalType":"address"},{"name":"shares","type":"uint8","internalType":"uint8"}]},{"name":"_oracle","type":"address","internalType":"address"},{"name":"_feeAddress","type":"address","internalType":"address"},{"name":"_collectFee","type":"bool","internalType":"bool"},{"name":"_categories","type":"string[]","internalType":"string[]"},{"name":"_uri","type":"string","internalType":"string"},{"name":"_initialSupportedTokens","type":"address[]","internalType":"contract IERC20[]"},{"name":"_expiryTimestamp","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"isApprovedForAll","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"operator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"onERC1155BatchReceived","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"from","type":"address","internalType":"address"},{"name":"ids","type":"uint256[]","internalType":"uint256[]"},{"name":"values","type":"uint256[]","internalType":"uint256[]"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC1155Received","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"from","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"oracle","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"payout","inputs":[{"name":"tokenAddresses","type":"address[]","internalType":"address[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"recipients","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"addr","type":"address","internalType":"address"},{"name":"shares","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"safeBatchTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"ids","type":"uint256[]","internalType":"uint256[]"},{"name":"values","type":"uint256[]","internalType":"uint256[]"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setApprovalForAll","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"approved","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"status","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enum Want.Status"}],"stateMutability":"view"},{"type":"function","name":"successCriteria","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"supportedTokens","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"title","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"tokenInfos","inputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"outputs":[{"name":"totalContributions","type":"uint256","internalType":"uint256"},{"name":"nftId","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"uri","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"wantGranted","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"wish","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"event","name":"ApprovalForAll","inputs":[{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"Contribution","inputs":[{"name":"contributor","type":"address","indexed":true,"internalType":"address"},{"name":"token","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"tokenId","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ContributionReturned","inputs":[{"name":"contributor","type":"address","indexed":true,"internalType":"address"},{"name":"token","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"Payout","inputs":[{"name":"tokens","type":"address[]","indexed":false,"internalType":"address[]"},{"name":"amounts","type":"uint256[]","indexed":false,"internalType":"uint256[]"}],"anonymous":false},{"type":"event","name":"RewardClaimed","inputs":[{"name":"claimer","type":"address","indexed":true,"internalType":"address"},{"name":"token","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TokenAdded","inputs":[{"name":"token","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TransferBatch","inputs":[{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"ids","type":"uint256[]","indexed":false,"internalType":"uint256[]"},{"name":"values","type":"uint256[]","indexed":false,"internalType":"uint256[]"}],"anonymous":false},{"type":"event","name":"TransferSingle","inputs":[{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"id","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"URI","inputs":[{"name":"value","type":"string","indexed":false,"internalType":"string"},{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"WantExpired","inputs":[],"anonymous":false},{"type":"error","name":"ERC1155InsufficientBalance","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"},{"name":"tokenId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC1155InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC1155InvalidArrayLength","inputs":[{"name":"idsLength","type":"uint256","internalType":"uint256"},{"name":"valuesLength","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC1155InvalidOperator","inputs":[{"name":"operator","type":"address","internalType":"address"}]},{"type":"error","name":"ERC1155InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC1155InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC1155MissingApprovalForAll","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"InvalidInitialization","inputs":[]},{"type":"error","name":"NotInitializing","inputs":[]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}
] as const;