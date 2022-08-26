import { Network } from 'utils/network';

export const binaryOptionsMarketDataContract = {
    addresses: {
        [Network.Mainnet]: '0x9819227C824637f4c93F14C4D83792084d7C5E9b',
        [Network.Ropsten]: '0x87e3C6e879d08F362dCfC5Bad6d9bec0923F2884',
        [Network.Rinkeby]: 'TBD',
        [Network.Kovan]: '0x42Af0890d254387110555A46d261B9e4f6E327Ac',
        // added to resolve error with typings
        [Network.Goerli]: '', // TODO: goerli network remove or implement
        [Network['Mainnet-Ovm']]: '0xE2881cAd27db4C27fB3814AD97ccA694B80c0fA0',
        [Network['Kovan-Ovm']]: '0xdBDAB336Cd97DB0F361DbD8C47EB4731674B62d7',
        [Network['POLYGON-MUMBAI']]: '0xd6BEd7D753DCbbbb8937Dd009788d6c815aE3094',
        [Network['POLYGON-MAINNET']]: '0xAF662BB75e9c1b6bb3e6EF9c0BD4Ac3507646B9A',
        [Network.BSC]: '0x308C5B6E489B693e1e582157aaBaF2d6df187aa1',
    },
    abi: [
        {
            constant: true,
            inputs: [
                {
                    internalType: 'contract BinaryOptionMarket',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'getAccountMarketData',
            outputs: [
                {
                    components: [
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'long',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'short',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketData.OptionValues',
                            name: 'balances',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct BinaryOptionMarketData.AccountData',
                    name: '',
                    type: 'tuple',
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
                    internalType: 'contract BinaryOptionMarket',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'getMarketData',
            outputs: [
                {
                    components: [
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'price',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'updatedAt',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketData.OraclePriceAndTimestamp',
                            name: 'oraclePriceAndTimestamp',
                            type: 'tuple',
                        },
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'deposited',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketData.Deposits',
                            name: 'deposits',
                            type: 'tuple',
                        },
                        {
                            components: [
                                {
                                    internalType: 'bool',
                                    name: 'resolved',
                                    type: 'bool',
                                },
                                {
                                    internalType: 'bool',
                                    name: 'canResolve',
                                    type: 'bool',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketData.Resolution',
                            name: 'resolution',
                            type: 'tuple',
                        },
                        {
                            internalType: 'enum IBinaryOptionMarket.Phase',
                            name: 'phase',
                            type: 'uint8',
                        },
                        {
                            internalType: 'enum IBinaryOptionMarket.Side',
                            name: 'result',
                            type: 'uint8',
                        },
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'long',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'short',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketData.OptionValues',
                            name: 'totalSupplies',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct BinaryOptionMarketData.MarketData',
                    name: '',
                    type: 'tuple',
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
                    internalType: 'contract BinaryOptionMarket',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'getMarketParameters',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'creator',
                            type: 'address',
                        },
                        {
                            components: [
                                {
                                    internalType: 'contract BinaryOption',
                                    name: 'long',
                                    type: 'address',
                                },
                                {
                                    internalType: 'contract BinaryOption',
                                    name: 'short',
                                    type: 'address',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarket.Options',
                            name: 'options',
                            type: 'tuple',
                        },
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'maturity',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'expiry',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarket.Times',
                            name: 'times',
                            type: 'tuple',
                        },
                        {
                            components: [
                                {
                                    internalType: 'bytes32',
                                    name: 'key',
                                    type: 'bytes32',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'strikePrice',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'finalPrice',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'bool',
                                    name: 'customMarket',
                                    type: 'bool',
                                },
                                {
                                    internalType: 'address',
                                    name: 'iOracleInstanceAddress',
                                    type: 'address',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarket.OracleDetails',
                            name: 'oracleDetails',
                            type: 'tuple',
                        },
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'poolFee',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'creatorFee',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct BinaryOptionMarketManager.Fees',
                            name: 'fees',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct BinaryOptionMarketData.MarketParameters',
                    name: '',
                    type: 'tuple',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ],
};

export default binaryOptionsMarketDataContract;
