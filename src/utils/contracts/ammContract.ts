import { Network } from 'utils/network';

export const ammContract = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.Ropsten]: 'TBD',
        [Network.Rinkeby]: 'TBD',
        [Network.Kovan]: 'TBD',
        // added to resolve error with typings
        [Network.Goerli]: '', // TODO: goerli network remove or implement
        [Network['Mainnet-Ovm']]: '0x5ae7454827D83526261F3871C1029792644Ef1B1',
        [Network['Kovan-Ovm']]: '0xfed727f37e921Faac22e36E0bbaA8504B45F6e3f',
        [Network['POLYGON-MUMBAI']]: '0xdf0A5bf80E8009f2702E7d164A7bdeaa79013eba',
        [Network['POLYGON-MAINNET']]: '0x9b6d76B1C6140FbB0ABc9C4a348BFf4e4e8a1213',
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
            name: 'SetBinaryOptionsMarketManager',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_capPerMarket',
                    type: 'uint256',
                },
            ],
            name: 'SetCapPerMarket',
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
            ],
            name: 'availableToSellToAMM',
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
            name: 'buyPriceImpact',
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
                    internalType: 'uint256',
                    name: 'price',
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
            constant: false,
            inputs: [
                {
                    internalType: 'address payable',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'retrieveSUSD',
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
                    name: '_manager',
                    type: 'address',
                },
            ],
            name: 'setBinaryOptionsMarketManager',
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
                    name: '_capPerMarket',
                    type: 'uint256',
                },
            ],
            name: 'setCapPerMarket',
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
                    name: '_spread',
                    type: 'uint256',
                },
            ],
            name: 'setMaxSpread',
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
                    name: '_spread',
                    type: 'uint256',
                },
            ],
            name: 'setMinSpread',
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
                    internalType: 'contract IPriceFeed',
                    name: '_priceFeed',
                    type: 'address',
                },
            ],
            name: 'setPriceFeed',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    internalType: 'contract IERC20',
                    name: '_sUSD',
                    type: 'address',
                },
            ],
            name: 'setSUSD',
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
    ],
};

export default ammContract;
