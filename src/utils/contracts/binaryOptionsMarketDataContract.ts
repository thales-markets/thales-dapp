import { Network } from 'enums/network';

const binaryOptionsMarketDataContract = {
    addresses: {
        [Network.Mainnet]: '0x9819227C824637f4c93F14C4D83792084d7C5E9b',
        [Network.OptimismMainnet]: '0x21382a033E581a2D685826449d6c9b3d6507e23C',
        [Network.OptimismSepolia]: 'TBD',
        [Network.PolygonMainnet]: '0x3198ab211cdf3e4d13a698e1fb819507bca2e579',
        [Network.Arbitrum]: '0x036adEA6bc1fD0247c2796f8D201B28C0dC2a67d',
        [Network.Base]: '0x22Eb15Fb53B61B470cabbe9fC268a1b67E675ff9',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'oldOwner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerNominated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'isPaused',
                    type: 'bool',
                },
            ],
            name: 'PauseChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_manager',
                    type: 'address',
                },
            ],
            name: 'PositionalMarketManagerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_rangedMarketsAMM',
                    type: 'address',
                },
            ],
            name: 'SetRangedMarketsAMM',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_thalesAMM',
                    type: 'address',
                },
            ],
            name: 'SetThalesAMM',
            type: 'event',
        },
        {
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract PositionalMarket',
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
                                    name: 'up',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'down',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct PositionalMarketData.OptionValues',
                            name: 'balances',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.AccountData',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: 'markets',
                    type: 'address[]',
                },
                {
                    internalType: 'enum IThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
            ],
            name: 'getActiveMarketsInfoPerPosition',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'market',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'price',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'liquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int256',
                            name: 'priceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'strikePrice',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.ActiveMarketsInfoPerPosition[]',
                    name: '',
                    type: 'tuple[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'getAmmMarketData',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'upBuyLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'downBuyLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'upSellLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'downSellLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'upBuyPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'downBuyPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'upSellPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'downSellPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int256',
                            name: 'upBuyPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'int256',
                            name: 'downBuyPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'int256',
                            name: 'upSellPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'int256',
                            name: 'downSellPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'iv',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'isMarketInAMMTrading',
                            type: 'bool',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.AmmMarketData',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'getAvailableAssets',
            outputs: [
                {
                    internalType: 'bytes32[]',
                    name: '',
                    type: 'bytes32[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'start',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'end',
                    type: 'uint256',
                },
            ],
            name: 'getBatchBasePricesForAllActiveMarkets',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'market',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'upPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'downPrice',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.ActiveMarketsPrices[]',
                    name: '',
                    type: 'tuple[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'start',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'end',
                    type: 'uint256',
                },
            ],
            name: 'getBatchPriceImpactForAllActiveMarkets',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'market',
                            type: 'address',
                        },
                        {
                            internalType: 'int256',
                            name: 'upPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'int256',
                            name: 'downPriceImpact',
                            type: 'int256',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.ActiveMarketsPriceImpact[]',
                    name: '',
                    type: 'tuple[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract PositionalMarket',
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
                            internalType: 'struct PositionalMarketData.OraclePriceAndTimestamp',
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
                            internalType: 'struct PositionalMarketData.Deposits',
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
                            internalType: 'struct PositionalMarketData.Resolution',
                            name: 'resolution',
                            type: 'tuple',
                        },
                        {
                            internalType: 'enum IPositionalMarket.Phase',
                            name: 'phase',
                            type: 'uint8',
                        },
                        {
                            internalType: 'enum IPositionalMarket.Side',
                            name: 'result',
                            type: 'uint8',
                        },
                        {
                            components: [
                                {
                                    internalType: 'uint256',
                                    name: 'up',
                                    type: 'uint256',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'down',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct PositionalMarketData.OptionValues',
                            name: 'totalSupplies',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.MarketData',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract PositionalMarket',
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
                                    internalType: 'contract Position',
                                    name: 'up',
                                    type: 'address',
                                },
                                {
                                    internalType: 'contract Position',
                                    name: 'down',
                                    type: 'address',
                                },
                            ],
                            internalType: 'struct PositionalMarket.Options',
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
                            internalType: 'struct PositionalMarket.Times',
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
                            internalType: 'struct PositionalMarket.OracleDetails',
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
                            internalType: 'struct PositionalMarketManager.Fees',
                            name: 'fees',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.MarketParameters',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    internalType: 'uint256',
                    name: 'strikeDateParam',
                    type: 'uint256',
                },
            ],
            name: 'getMarketsForAssetAndStrikeDate',
            outputs: [
                {
                    internalType: 'address[]',
                    name: '',
                    type: 'address[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
            ],
            name: 'getMaturityDates',
            outputs: [
                {
                    internalType: 'uint256[]',
                    name: '',
                    type: 'uint256[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: 'markets',
                    type: 'address[]',
                },
                {
                    internalType: 'enum RangedMarket.Position',
                    name: 'position',
                    type: 'uint8',
                },
            ],
            name: 'getRangedActiveMarketsInfoPerPosition',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'market',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'price',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'liquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int256',
                            name: 'priceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'leftPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'rightPrice',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.RangedMarketsInfoPerPosition[]',
                    name: '',
                    type: 'tuple[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract RangedMarket',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'getRangedAmmMarketData',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'inBuyLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'outBuyLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'inSellLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'outSellLiquidity',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'inBuyPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'outBuyPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'inSellPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'outSellPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int256',
                            name: 'inPriceImpact',
                            type: 'int256',
                        },
                        {
                            internalType: 'int256',
                            name: 'outPriceImpact',
                            type: 'int256',
                        },
                    ],
                    internalType: 'struct PositionalMarketData.RangedAmmMarketData',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'lastPauseTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'manager',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'nominateNewOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'nominatedOwner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rangedMarketsAMM',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'setOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: '_paused',
                    type: 'bool',
                },
            ],
            name: 'setPaused',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_manager',
                    type: 'address',
                },
            ],
            name: 'setPositionalMarketManager',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_rangedMarketsAMM',
                    type: 'address',
                },
            ],
            name: 'setRangedMarketsAMM',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_thalesAMM',
                    type: 'address',
                },
            ],
            name: 'setThalesAMM',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'thalesAMM',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'proxyAddress',
                    type: 'address',
                },
            ],
            name: 'transferOwnershipAtInit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default binaryOptionsMarketDataContract;
