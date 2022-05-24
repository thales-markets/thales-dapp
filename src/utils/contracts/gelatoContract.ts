import { Network } from 'utils/network';

export const GELATO_POOL_ADDRESS = '0xac6705BC7f6a35eb194bdB89066049D6f1B0B1b5'; // thales/WETH
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
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
            {
                name: '_spender',
                type: 'address',
            },
        ],
        name: 'allowance',
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
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const gelatoContract = {
    abi: GELATO_POOL_ABI,
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.Ropsten]: 'TBD',
        [Network.Rinkeby]: 'TBD',
        [Network.Kovan]: 'TBD',
        // added to resolve error with typings
        [Network.Goerli]: '', // TODO: goerli network remove or implement
        [Network['Mainnet-Ovm']]: GELATO_POOL_ADDRESS,
        [Network['Kovan-Ovm']]: 'TBD',
        [Network['POLYGON-MUMBAI']]: 'TBD',
        [Network['POLYGON-MAINNET']]: 'TBD',
    },
};
