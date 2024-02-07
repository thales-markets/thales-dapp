import { Network } from 'enums/network';

const chainedSpeedMarketsAMMContract = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.OptimismMainnet]: '0xFf8Cf5ABF583D0979C0B9c35d62dd1fD52cce7C7',
        [Network.OptimismGoerli]: '0xe9FdD4717f9dDAa7e74e9a63B559F54A38f98613',
        [Network.OptimismSepolia]: 'TBD',
        [Network.PolygonMainnet]: '0x14D2d7f64D6F10f8eF06372c2e5E36850661a537',
        [Network.Arbitrum]: '0xe92B4c614b04c239d30c31A7ea1290AdDCb8217D',
        [Network.Base]: '0x6848F001ddDb4442d352C495c7B4a231e3889b70',
        [Network.ZkSync]: 'TBD',
        [Network.ZkSyncSepolia]: 'TBD',
        [Network.BlastSepolia]: 'TBD',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_addressManager',
                    type: 'address',
                },
            ],
            name: 'AddressManagerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_destination',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'AmountTransfered',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: '_minTimeFrame',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: '_maxTimeFrame',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_minChainedMarkets',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_maxChainedMarkets',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_minBuyinAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_maxBuyinAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_maxProfitPerIndividualMarket',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_maxRisk',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: '_payoutMultipliers',
                    type: 'uint256[]',
                },
            ],
            name: 'LimitParamsChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: 'timeFrame',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: 'strikeTime',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'int64',
                    name: 'strikePrice',
                    type: 'int64',
                },
                {
                    indexed: false,
                    internalType: 'enum SpeedMarket.Direction[]',
                    name: 'directions',
                    type: 'uint8[]',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'buyinAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'payoutMultiplier',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'safeBoxImpact',
                    type: 'uint256',
                },
            ],
            name: 'MarketCreated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'userIsWinner',
                    type: 'bool',
                },
            ],
            name: 'MarketResolved',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'mastercopy',
                    type: 'address',
                },
            ],
            name: 'MastercopyChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: '_enabled',
                    type: 'bool',
                },
            ],
            name: 'MultiCollateralOnOffRampEnabled',
            type: 'event',
        },
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
                    name: 'refferer',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'trader',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'volume',
                    type: 'uint256',
                },
            ],
            name: 'ReferrerPaid',
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
                    internalType: 'uint256',
                    name: 'index',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'pageSize',
                    type: 'uint256',
                },
            ],
            name: 'activeMarkets',
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
                    internalType: 'uint256',
                    name: 'index',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'pageSize',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
            ],
            name: 'activeMarketsPerUser',
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
            inputs: [],
            name: 'addressManager',
            outputs: [
                {
                    internalType: 'contract IAddressManager',
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
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'canResolveMarket',
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
            name: 'chainedSpeedMarketMastercopy',
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
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    internalType: 'uint64',
                    name: 'timeFrame',
                    type: 'uint64',
                },
                {
                    internalType: 'enum SpeedMarket.Direction[]',
                    name: 'directions',
                    type: 'uint8[]',
                },
                {
                    internalType: 'uint256',
                    name: 'buyinAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes[]',
                    name: 'priceUpdateData',
                    type: 'bytes[]',
                },
                {
                    internalType: 'address',
                    name: 'referrer',
                    type: 'address',
                },
            ],
            name: 'createNewMarket',
            outputs: [],
            stateMutability: 'payable',
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
                    internalType: 'uint64',
                    name: 'timeFrame',
                    type: 'uint64',
                },
                {
                    internalType: 'enum SpeedMarket.Direction[]',
                    name: 'directions',
                    type: 'uint8[]',
                },
                {
                    internalType: 'bytes[]',
                    name: 'priceUpdateData',
                    type: 'bytes[]',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'collateralAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'bool',
                    name: 'isEth',
                    type: 'bool',
                },
                {
                    internalType: 'address',
                    name: 'referrer',
                    type: 'address',
                },
            ],
            name: 'createNewMarketWithDifferentCollateral',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'currentRisk',
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
            inputs: [
                {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
            ],
            name: 'getLengths',
            outputs: [
                {
                    internalType: 'uint256[4]',
                    name: '',
                    type: 'uint256[4]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'initNonReentrant',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'contract IERC20Upgradeable',
                    name: '_sUSD',
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
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'index',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'pageSize',
                    type: 'uint256',
                },
            ],
            name: 'maturedMarkets',
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
                    internalType: 'uint256',
                    name: 'index',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'pageSize',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
            ],
            name: 'maturedMarketsPerUser',
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
            inputs: [],
            name: 'maxBuyinAmount',
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
            name: 'maxChainedMarkets',
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
            name: 'maxProfitPerIndividualMarket',
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
            name: 'maxRisk',
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
            name: 'maxTimeFrame',
            outputs: [
                {
                    internalType: 'uint64',
                    name: '',
                    type: 'uint64',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'minBuyinAmount',
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
            name: 'minChainedMarkets',
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
            name: 'minTimeFrame',
            outputs: [
                {
                    internalType: 'uint64',
                    name: '',
                    type: 'uint64',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'multicollateralEnabled',
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
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'payoutMultipliers',
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
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'bytes[][]',
                    name: 'priceUpdateData',
                    type: 'bytes[][]',
                },
            ],
            name: 'resolveMarket',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'int64[]',
                    name: '_finalPrices',
                    type: 'int64[]',
                },
            ],
            name: 'resolveMarketAsOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'int64[]',
                    name: '_finalPrices',
                    type: 'int64[]',
                },
            ],
            name: 'resolveMarketManually',
            outputs: [],
            stateMutability: 'nonpayable',
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
                    internalType: 'int64[][]',
                    name: 'finalPrices',
                    type: 'int64[][]',
                },
            ],
            name: 'resolveMarketManuallyBatch',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'bytes[][]',
                    name: 'priceUpdateData',
                    type: 'bytes[][]',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'toEth',
                    type: 'bool',
                },
            ],
            name: 'resolveMarketWithOfframp',
            outputs: [],
            stateMutability: 'payable',
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
                    internalType: 'bytes[][][]',
                    name: 'priceUpdateData',
                    type: 'bytes[][][]',
                },
            ],
            name: 'resolveMarketsBatch',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'sUSD',
            outputs: [
                {
                    internalType: 'contract IERC20Upgradeable',
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
                    name: '_addressManager',
                    type: 'address',
                },
            ],
            name: 'setAddressManager',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint64',
                    name: '_minTimeFrame',
                    type: 'uint64',
                },
                {
                    internalType: 'uint64',
                    name: '_maxTimeFrame',
                    type: 'uint64',
                },
                {
                    internalType: 'uint256',
                    name: '_minChainedMarkets',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxChainedMarkets',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_minBuyinAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxBuyinAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxProfitPerIndividualMarket',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxRisk',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256[]',
                    name: '_payoutMultipliers',
                    type: 'uint256[]',
                },
            ],
            name: 'setLimitParams',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_mastercopy',
                    type: 'address',
                },
            ],
            name: 'setMastercopy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: '_enabled',
                    type: 'bool',
                },
            ],
            name: 'setMultiCollateralOnOffRampEnabled',
            outputs: [],
            stateMutability: 'nonpayable',
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
                    name: '_destination',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'transferAmount',
            outputs: [],
            stateMutability: 'nonpayable',
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
        {
            stateMutability: 'payable',
            type: 'receive',
        },
    ],
};

export default chainedSpeedMarketsAMMContract;
