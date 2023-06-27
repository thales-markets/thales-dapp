export const rangedMarketContract = {
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'burner',
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
                    internalType: 'enum RangedMarket.Position',
                    name: '_position',
                    type: 'uint8',
                },
            ],
            name: 'Burn',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'exerciser',
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
                    internalType: 'enum RangedMarket.Position',
                    name: '_position',
                    type: 'uint8',
                },
            ],
            name: 'Exercised',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'minter',
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
                    internalType: 'enum RangedMarket.Position',
                    name: '_position',
                    type: 'uint8',
                },
            ],
            name: 'Mint',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum RangedMarket.Position',
                    name: 'winningPosition',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'finalPrice',
                    type: 'uint256',
                },
            ],
            name: 'Resolved',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'claimant',
                    type: 'address',
                },
            ],
            name: 'burnIn',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'claimant',
                    type: 'address',
                },
            ],
            name: 'burnOut',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'canExercisePositions',
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
            name: 'canResolve',
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
            name: 'exercisePositions',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_leftMarket',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_rightMarket',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_in',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_out',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_rangedMarketsAMM',
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
            name: 'initialized',
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
            name: 'leftMarket',
            outputs: [
                {
                    internalType: 'contract IPositionalMarket',
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
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    internalType: 'enum RangedMarket.Position',
                    name: '_position',
                    type: 'uint8',
                },
                {
                    internalType: 'address',
                    name: 'minter',
                    type: 'address',
                },
            ],
            name: 'mint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'positions',
            outputs: [
                {
                    internalType: 'contract RangedPosition',
                    name: 'inp',
                    type: 'address',
                },
                {
                    internalType: 'contract RangedPosition',
                    name: 'outp',
                    type: 'address',
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
                    internalType: 'contract RangedMarketsAMM',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'resolveMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'resolved',
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
            name: 'result',
            outputs: [
                {
                    internalType: 'enum RangedMarket.Position',
                    name: '',
                    type: 'uint8',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rightMarket',
            outputs: [
                {
                    internalType: 'contract IPositionalMarket',
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
                    name: 'recipient',
                    type: 'address',
                },
            ],
            name: 'withdrawCollateral',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default rangedMarketContract;
