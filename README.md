<p align="center">
  <img src="logo_placeholder.png" alt="WantIt Logo" width="200" height="200">
</p>

<h1 align="center">WantIt</h1>

<p align="center">
  <a href="https://github.com/swapnilraj/wantit/actions/workflows/ci.yml">
    <img src="https://github.com/swapnilraj/wantit/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  </a>
  <a href="https://github.com/swapnilraj/wantit/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://github.com/swapnilraj/wantit/stargazers">
    <img src="https://img.shields.io/github/stars/swapnilraj/wantit" alt="Stars">
  </a>
</p>

WantIt is a revolutionary platform that empowers users to incentivize and influence others to take action using the power of blockchain technology. With WantIt, you can create a wish that targets specific individuals or organizations, and let the community come together to fund the wish and encourage the targeted parties to fulfill it.

## Why WantIt?

In today's world, many great ideas and initiatives often remain unrealized due to lack of resources or motivation. WantIt aims to change that by leveraging the decentralized nature of blockchain and the collective power of the community. By creating a wish on WantIt and associating it with target addresses, you open up the possibility for others to contribute funds and incentivize the targeted parties to take action and make the wish a reality.

## Key Features

- **Wish Creation**: Easily create and publish your wishes on the WantIt platform.
- **Community Funding**: Let the community support your wishes through secure blockchain transactions.
- **Transparency**: Track the progress of your wish and see the contributions made by the community.
- **Wish Fulfillment**: Once your wish reaches its funding goal, it becomes a reality!

## Examples

1. **Convincing Elon Musk to Buy Twitter**: Encourage Elon Musk to acquire Twitter and transform it into a platform for free speech. Let the community rally behind this cause and incentivize Elon to make a bold move.

2. **Demand Apple to Go Open Source**: Urge Apple to open source their operating systems and promote transparency. Harness the power of the community to pressure Apple and advocate for a more open and collaborative tech ecosystem.

3. **Crypto Showdown: Vitalik vs. CZ**: Target Vitalik Buterin (vitalik.eth) and Changpeng Zhao (cz.eth), the influential figures behind Ethereum and Binance respectively. Dare them to engage in an epic wrestling match that will captivate the entire crypto community. Let the community pool funds to make this dream match a reality and witness the ultimate battle of blockchain titans.

## Setup Instructions

### Frontend

1. Clone the repository: `git clone https://github.com/swapnilraj/wantit.git`
2. Navigate to the frontend directory: `cd wantit/frontend` 
3. Install dependencies: `bun install`
4. Start the development server: `bun run dev`

### Backend

1. Navigate to the backend directory: `cd wantit/backend`
2. Install dependencies: `bun install`
3. Configure the environment variables in `.env` file
4. Start the backend server: `bun run start`

## Contributors 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/swapnilraj"><img src="https://avatars.githubusercontent.com/u/1234567?v=4" width="100px;" alt=""/><br /><sub><b>Swapnil Raj</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

TODO:

1. Keep a track of the creator of the pools
2. Add a chat / discussion feature for each pool.
3. Extend with voting polls - should I do x y or z?
4. Arc pools: Do x, y and z, complete more get more rewards overall
5. News / tweet streams about this topicx

What if we created the following NFT minting strcuture:

For every token in the pool's whitelist we provide an NFT mint transfer function:
1. The NFT is minted iff the amount provided to the pool is 10% of the total raised so far
2. This makes every subsequent NFT exponentially more costly than the last.
3. This also ads a tollerable amount of ponzinomics to the NFT emission system.
4. 1 NFT minted to the deployer addres
5. 1 NFT minted to the protocol deployer address


How Voting pools work:

A person sets up a pool which gives the targets (possibly themselves) a set of options to complete
The oracle resolves the pool if at anytime any ONE of the conditions resolves.

Users add funds to the pool to vote on their preference. Likely the target will enact the request of the highest value pool.

If the highest value pool is completed either (tbd)
- all funds go to the target addresses?
- or all the funds of the vote pool go to the target
- or all and a percentage of the others go to the target
  note: generally I like that a portion of the other pools go to the winning result because this adds a extra level of intrigue to the outcome. A small advantage in one pool leads to large reward. etc.
If a lower value outcome occurs then either (tbd)
- All the funds are returned to users
- All the funds in the selected pool go to the target address. The rest is returned
- The funds in the pool with some penalty go to the target address. The rest returned.
Note that the introduction of the primitive - the funds are returned. Really messes with the
trust structures and can introduce many more socio economic games that could be considered unfair by users.

In simpler pools, as I've created the money accrues, and it does not get returned to the users. Only a resolution will unlock the funds and only to the target addresses. This makes them more robust, but possible less popular?


Deadlines
Deadlines return the assets to the users if the pools are not resolved on time.