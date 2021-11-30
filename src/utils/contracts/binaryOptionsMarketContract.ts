export const binaryOptionMarketContract = {
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum IBinaryOptionMarket.Side',
                    name: 'result',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'oraclePrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'oracleTimestamp',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'deposited',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'poolFees',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'creatorFees',
                    type: 'uint256',
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
                    internalType: 'enum IBinaryOptionMarket.Side',
                    name: 'side',
                    type: 'uint8',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Mint',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'OptionsExercised',
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
            inputs: [],
            name: 'accumulatedFees',
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
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'balancesOf',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'canResolve',
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
            name: 'creator',
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
            name: 'customMarket',
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
            name: 'deposited',
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
            name: 'exerciseOptions',
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
                    internalType: 'address payable',
                    name: 'beneficiary',
                    type: 'address',
                },
            ],
            name: 'expire',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'fees',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'iOracleInstance',
            outputs: [
                {
                    internalType: 'contract IOracleInstance',
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
            name: 'initialMint',
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
                    components: [
                        {
                            internalType: 'address',
                            name: 'owner',
                            type: 'address',
                        },
                        {
                            internalType: 'address',
                            name: 'binaryOptionMastercopy',
                            type: 'address',
                        },
                        {
                            internalType: 'contract IAddressResolver',
                            name: 'resolver',
                            type: 'address',
                        },
                        {
                            internalType: 'contract IPriceFeed',
                            name: 'priceFeed',
                            type: 'address',
                        },
                        {
                            internalType: 'address',
                            name: 'creator',
                            type: 'address',
                        },
                        {
                            internalType: 'bytes32',
                            name: 'oracleKey',
                            type: 'bytes32',
                        },
                        {
                            internalType: 'uint256',
                            name: 'strikePrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256[2]',
                            name: 'times',
                            type: 'uint256[2]',
                        },
                        {
                            internalType: 'uint256',
                            name: 'deposit',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256[2]',
                            name: 'fees',
                            type: 'uint256[2]',
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
                    internalType: 'struct BinaryOptionMarket.BinaryOptionMarketParameters',
                    name: '_parameters',
                    type: 'tuple',
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
            inputs: [],
            name: 'initialized',
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
            constant: false,
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'mint',
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
            name: 'options',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'oracleDetails',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'oraclePrice',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'price',
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
            name: 'oraclePriceAndTimestamp',
            outputs: [
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
            name: 'phase',
            outputs: [
                {
                    internalType: 'enum IBinaryOptionMarket.Phase',
                    name: '',
                    type: 'uint8',
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
            name: 'requireUnpaused',
            outputs: [],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [],
            name: 'resolve',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'resolved',
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
            name: 'resolver',
            outputs: [
                {
                    internalType: 'contract IAddressResolver',
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
            name: 'result',
            outputs: [
                {
                    internalType: 'enum IBinaryOptionMarket.Side',
                    name: '',
                    type: 'uint8',
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
                    name: '_address',
                    type: 'address',
                },
            ],
            name: 'setIOracleInstance',
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
                    internalType: 'address',
                    name: '_zeroExAddress',
                    type: 'address',
                },
            ],
            name: 'setZeroExAddress',
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
                    name: '_zeroExAddress',
                    type: 'address',
                },
            ],
            name: 'setZeroExAddressAtInit',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'times',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'totalSupplies',
            outputs: [
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
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'zeroExAddress',
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
    ],
};

export default binaryOptionMarketContract;
