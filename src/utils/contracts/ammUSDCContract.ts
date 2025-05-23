import { Network } from 'enums/network';

const ammUSDCContract = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.OptimismMainnet]: '0x9Ce94cdf8eCd57cec0835767528DC88628891dd9',
        [Network.OptimismSepolia]: 'TBD',
        [Network.PolygonMainnet]: 'TBD',
        [Network.Arbitrum]: 'TBD',
        [Network.Base]: 'TBD',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'buyer',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
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
                    name: 'sUSDPaid',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'susd',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'asset',
                    type: 'address',
                },
            ],
            name: 'BoughtFromAmm',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'buyer',
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
                    name: 'sUSDPaid',
                    type: 'uint256',
                },
            ],
            name: 'BoughtWithDiscount',
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
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_cap',
                    type: 'uint256',
                },
            ],
            name: 'SetCapPerAsset',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_impliedVolatility',
                    type: 'uint256',
                },
            ],
            name: 'SetImpliedVolatilityPerAsset',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_spread',
                    type: 'uint256',
                },
            ],
            name: 'SetMaxSpread',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'minPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'capPerMarket',
                    type: 'uint256',
                },
            ],
            name: 'SetMinMaxSupportedPriceCapPerMarket',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_spread',
                    type: 'uint256',
                },
            ],
            name: 'SetMinSpread',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_minimalTimeLeftToMaturity',
                    type: 'uint256',
                },
            ],
            name: 'SetMinimalTimeLeftToMaturity',
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
            name: 'SetPositionalMarketManager',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_priceFeed',
                    type: 'address',
                },
            ],
            name: 'SetPriceFeed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'sUSD',
                    type: 'address',
                },
            ],
            name: 'SetSUSD',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_safeBox',
                    type: 'address',
                },
            ],
            name: 'SetSafeBox',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_safeBoxImpact',
                    type: 'uint256',
                },
            ],
            name: 'SetSafeBoxImpact',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'seller',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
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
                    name: 'sUSDPaid',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'susd',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'asset',
                    type: 'address',
                },
            ],
            name: 'SoldToAMM',
            type: 'event',
        },
        {
            constant: true,
            inputs: [],
            name: 'MAX_APPROVAL',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
            ],
            name: 'availableToBuyFromAMM',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_available',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
            ],
            name: 'availableToSellToAMM',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_available',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedPayout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'additionalSlippage',
                    type: 'uint256',
                },
            ],
            name: 'buyFromAMM',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedPayout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'additionalSlippage',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_referrer',
                    type: 'address',
                },
            ],
            name: 'buyFromAMMWithDifferentCollateralAndReferrer',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedPayout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'additionalSlippage',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '_referrer',
                    type: 'address',
                },
            ],
            name: 'buyFromAMMWithReferrer',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'buyFromAmmQuote',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_quote',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
            ],
            name: 'buyFromAmmQuoteWithDifferentCollateral',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'collateralQuote',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'sUSDToPay',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'buyPriceImpact',
            outputs: [
                {
                    internalType: 'int256',
                    name: '_available',
                    type: 'int256',
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
                    internalType: 'uint256',
                    name: '_price',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'strike',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'timeLeftInDays',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'volatility',
                    type: 'uint256',
                },
            ],
            name: 'calculateOdds',
            outputs: [
                {
                    internalType: 'uint256',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'canExerciseMaturedMarket',
            outputs: [
                {
                    internalType: 'bool',
                    name: '_canExercise',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'capPerMarket',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'curveOnrampEnabled',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'curveSUSD',
            outputs: [
                {
                    internalType: 'contract ICurveSUSD',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'dai',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'deciMath',
            outputs: [
                {
                    internalType: 'contract DeciMath',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'exerciseMaturedMarket',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
            ],
            name: 'getCapPerAsset',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_cap',
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
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'impliedVolatilityPerAsset',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'initNonReentrant',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'contract IPriceFeed',
                    name: '_priceFeed',
                    type: 'address',
                },
                {
                    internalType: 'contract IERC20',
                    name: '_sUSD',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_capPerMarket',
                    type: 'uint256',
                },
                {
                    internalType: 'contract DeciMath',
                    name: '_deciMath',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_min_spread',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_max_spread',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_minimalTimeLeftToMaturity',
                    type: 'uint256',
                },
            ],
            name: 'initialize',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
            ],
            name: 'isMarketInAMMTrading',
            outputs: [
                {
                    internalType: 'bool',
                    name: 'isTrading',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'lastPauseTime',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'manager',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'maxAllowedPegSlippagePercentage',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'maxSupportedPrice',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'max_spread',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'minSupportedPrice',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'min_spread',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'minimalTimeLeftToMaturity',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'nominateNewOwner',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'nominatedOwner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'previousManager',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
            ],
            name: 'price',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'priceToReturn',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'priceFeed',
            outputs: [
                {
                    internalType: 'contract IPriceFeed',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'referrals',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'referrerFee',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address payable',
                    name: 'account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'retrieveSUSDAmount',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'sUSD',
            outputs: [
                {
                    internalType: 'contract IERC20',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'safeBox',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'safeBoxImpact',
            outputs: [
                {
                    internalType: 'uint256',
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
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'sellPriceImpact',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_impact',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedPayout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'additionalSlippage',
                    type: 'uint256',
                },
            ],
            name: 'sellToAMM',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    internalType: 'enum ThalesAMM.Position',
                    name: 'position',
                    type: 'uint8',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'sellToAmmQuote',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '_quote',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    internalType: 'uint256',
                    name: '_cap',
                    type: 'uint256',
                },
            ],
            name: 'setCapPerAsset',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_curveSUSD',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_dai',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_usdc',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_usdt',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: '_curveOnrampEnabled',
                    type: 'bool',
                },
                {
                    internalType: 'uint256',
                    name: '_maxAllowedPegSlippagePercentage',
                    type: 'uint256',
                },
            ],
            name: 'setCurveSUSD',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'asset',
                    type: 'bytes32',
                },
                {
                    internalType: 'uint256',
                    name: '_impliedVolatility',
                    type: 'uint256',
                },
            ],
            name: 'setImpliedVolatilityPerAsset',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_minspread',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxspread',
                    type: 'uint256',
                },
            ],
            name: 'setMinMaxSpread',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_minSupportedPrice',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxSupportedPrice',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_capPerMarket',
                    type: 'uint256',
                },
            ],
            name: 'setMinMaxSupportedPriceAndCap',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_minimalTimeLeftToMaturity',
                    type: 'uint256',
                },
            ],
            name: 'setMinimalTimeLeftToMaturity',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'setOwner',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'bool',
                    name: '_paused',
                    type: 'bool',
                },
            ],
            name: 'setPaused',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_manager',
                    type: 'address',
                },
            ],
            name: 'setPositionalMarketManager',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'contract IPriceFeed',
                    name: '_priceFeed',
                    type: 'address',
                },
                {
                    internalType: 'contract IERC20',
                    name: '_sUSD',
                    type: 'address',
                },
            ],
            name: 'setPriceFeedAndSUSD',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_safeBox',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_safeBoxImpact',
                    type: 'uint256',
                },
            ],
            name: 'setSafeBoxData',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'contract IStakingThales',
                    name: '_stakingThales',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_referrals',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_referrerFee',
                    type: 'uint256',
                },
            ],
            name: 'setStakingThalesAndReferrals',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: '_address',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'enabled',
                    type: 'bool',
                },
            ],
            name: 'setWhitelistedAddress',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'spentOnMarket',
            outputs: [
                {
                    internalType: 'uint256',
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
            inputs: [],
            name: 'stakingThales',
            outputs: [
                {
                    internalType: 'contract IStakingThales',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'proxyAddress',
                    type: 'address',
                },
            ],
            name: 'transferOwnershipAtInit',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'usdc',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'usdt',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
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
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'whitelistedAddresses',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ],
};

export default ammUSDCContract;
