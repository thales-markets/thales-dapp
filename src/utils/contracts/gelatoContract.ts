import { NetworkId } from '@synthetixio/contracts-interface';

const GELATO_POOL_ADDRESS = '0x7fad8444688c4babb792e960359ea467fd28d030'; // sLong/WETH
const GELATO_POOL_ABI = [
    {
        inputs: [],
        name: 'getUnderlyingBalances',
        outputs: [
            { internalType: 'uint256', name: 'amount0Current', type: 'uint256' },
            { internalType: 'uint256', name: 'amount1Current', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

export const gelatoContract = {
    abi: GELATO_POOL_ABI,
    addresses: {
        [NetworkId.Mainnet]: 'TBD',
        [NetworkId.Ropsten]: 'TBD',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: 'TBD',
        // added to resolve error with typings
        [NetworkId.Goerli]: '', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: GELATO_POOL_ADDRESS,
        [NetworkId['Kovan-Ovm']]: 'TBD',
    },
};
