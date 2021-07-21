import { NetworkId } from '@synthetixio/contracts-interface';

export const binaryOptionsMarketDataContract = {
    addresses: {
        [NetworkId.Mainnet]: '0x2206BD16eb8216A89Cb779590301a0D61b1b6e41',
        [NetworkId.Ropsten]: '0xD308fF11A3D06b184c68AF0B9A003468a4A3c1a5',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: '0xE6f6A47c4b88ACA97BFc96adD63cB736f2037E0a',
        // added to resolve error with typings
        [NetworkId.Goerli]: '', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: '', // TODO: mainnet-ovm remove or implement
        [NetworkId['Kovan-Ovm']]: '', // TODO: kovan-ovm remove or implement
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
