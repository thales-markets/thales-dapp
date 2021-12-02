import { NetworkId } from '@synthetixio/contracts-interface';

export const binaryOptionsMarketDataContract = {
    addresses: {
        [NetworkId.Mainnet]: '0x9819227C824637f4c93F14C4D83792084d7C5E9b',
        [NetworkId.Ropsten]: '0x87e3C6e879d08F362dCfC5Bad6d9bec0923F2884',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: '0x42Af0890d254387110555A46d261B9e4f6E327Ac',
        // added to resolve error with typings
        [NetworkId.Goerli]: '', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: '0x1751dDCE8D8B917223e05D8bD015dfb81bF1fcf2',
        [NetworkId['Kovan-Ovm']]: '0xB16AC3207a571edC25F16B2EfbA79500F3046809',
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
