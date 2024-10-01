import type { NextApiRequest, NextApiResponse } from 'next'
import { createPublicClient, http, getContract, Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { WANT_FACTORY_ADDRESS, WANT_ABI, WANT_FACTORY_ABI } from '@/constants/contractInfo'
import { init, tx} from '@instantdb/admin'
import OpenAI from 'openai'

const RPC_URL = 'https://rpc.ankr.com/base_sepolia'

type WantsSchema = {
  wants: {
    [chainId: number]: {
        salt: number
        [contractAddress: Address]: {
          title: string,
          wish: string,
          successCriteria: string,
          oracle: Address,
          feeAddress: Address,
          collectFee: boolean,
          expiryTimestamp: bigint,
          status: string,
          recipients: Array<{ addr: Address, shares: number }>,
          categories: string[],
          supportedTokens: Address[]
        }
      }
}}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function isContentAppropriate(content: string): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a content moderator. Respond with 'true' if the content is appropriate and 'false' if it contains profanity, explicit content, or inappropriate material."
        },
        {
          role: "user",
          content: `Please evaluate this content: ${content}`
        }
      ],
      temperature: 0,
      max_tokens: 5,
    });

    const result = response.choices[0].message.content?.trim().toLowerCase();
    return result === 'true';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return true; // Default to true in case of API error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WantsSchema>
) {
  if (req.method !== 'GET') {
    res.status(405).json({
        wants: {
          [baseSepolia.id]: {
          salt: 0,
        }
      }
    })
  }

  const db = init<WantsSchema>({
    appId: '9eae0cad-26b2-41dc-9b8a-a2c8d2e10c7b',
    adminToken: process.env.INSTANT_APP_ADMIN_TOKEN as string,
  })

  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: baseSepolia,
    transport: http(RPC_URL),
  })

  const wantFactory = getContract({
    address: WANT_FACTORY_ADDRESS,
    abi: WANT_FACTORY_ABI,
    client,
  })

  // 1. Read salt from DB
  const query = {
    wantit: {
        $: {
          limit: 1
        }
      }
  };
  const data = await db.query(query);
  console.log(JSON.stringify(data, null, 2))
  const salt = data?.wantit[0]?.[baseSepolia.id]?.salt || 0;
  console.log({salt})

  // 2. Get Wants from RPC
  const wants: Address[] = Array.from(await wantFactory.read.getDeployedWantsFrom([BigInt(salt)]));
  console.log({wants});

  const wantsData: Omit<WantsSchema['wants'][number], 'salt'> = {};
  
  await Promise.all(wants.map(async (want) => {
    const wantContract = getContract({
      address: want,
      abi: WANT_ABI,
      client,
    });

    const [
      title,
      wish,
      successCriteria,
      oracle,
      feeAddress,
      collectFee,
      expiryTimestamp,
      status,
      recipients,
      categories,
      supportedTokens
    ] = await Promise.all([
      wantContract.read.title(),
      wantContract.read.wish(),
      wantContract.read.successCriteria(),
      wantContract.read.oracle(),
      wantContract.read.feeAddress(),
      wantContract.read.collectFee(),
      wantContract.read.expiryTimestamp(),
      wantContract.read.status(),
      wantContract.read.recipients([BigInt(0)]),
      wantContract.read.categories([BigInt(0)]),
      wantContract.read.supportedTokens([BigInt(0)])
    ]);

    wantsData[want] = {
      title,
      wish,
      successCriteria,
      oracle,
      feeAddress,
      collectFee,
      expiryTimestamp,
      status: status.toString(),
      recipients: Array.from([{addr: recipients[0], shares: recipients[1]} as {addr: Address, shares: number}]),
      categories: categories.split(','),
      supportedTokens: [supportedTokens],
    };
  }));

  const numWants = wants.length;

  // 3. Filter out wants based on ChatGPT's rules
  const filteredWants: Omit<WantsSchema['wants'][number], 'salt'> = {};
  await Promise.all(Object.entries(wantsData).map(async ([wantAddress, want]): Promise<void> => {
    const contentToCheck = `Title: ${want.title}\nWish: ${want.wish}\nSuccess Criteria: ${want.successCriteria}\nCategories: ${want.categories.join(', ')}`;
    const isAppropriate = await isContentAppropriate(contentToCheck);
    if (isAppropriate) {
      filteredWants[wantAddress as keyof typeof wantsData] = want;
    }
  }));

  // If there are no appropriate wants, return the current wants
  if (Object.keys(filteredWants).length === 0) {
    res.status(200).json({
      wants: {
        [baseSepolia.id]: {
          salt: Number(salt) + numWants,
        }
      }
    });
    return;
  }

  // 4. Update Wants in DB
  try {
    console.log("asdfasdf", {
      [baseSepolia.id]: {
      salt: Number(salt) + numWants,
      ...filteredWants,
      }
    })
    const transactions = tx.wantit["00000000-0000-0000-0000-000000000000"].update({
      [baseSepolia.id]: {
      salt: Number(salt) + numWants,
      ...filteredWants,
      }
    });
    await db.transact(transactions);

    console.log('Successfully updated Wants in DB');
  } catch (error) {
    console.error('Error updating Wants in DB:', error);
    //@ts-ignore
    res.status(500).json({error: error});
    return;
  }

  res.status(200).json({
      wants: {
        [baseSepolia.id]: {
          salt: Number(salt) + numWants,
        ...filteredWants,
        }
    }
  });
}
