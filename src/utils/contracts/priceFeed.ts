export const priceFeed = {
    abi: [
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'currencyKey',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'aggregator',
                    type: 'address',
                },
            ],
            name: 'AggregatorAdded',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'currencyKey',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'aggregator',
                    type: 'address',
                },
            ],
            name: 'AggregatorRemoved',
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
            constant: false,
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'currencyKey',
                    type: 'bytes32',
                },
                {
                    internalType: 'address',
                    name: 'aggregatorAddress',
                    type: 'address',
                },
            ],
            name: 'addAggregator',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'aggregatorKeys',
            outputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
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
            name: 'aggregators',
            outputs: [
                {
                    internalType: 'contract AggregatorV2V3Interface',
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
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'currencyKeyDecimals',
            outputs: [
                {
                    internalType: 'uint8',
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
            name: 'getCurrencies',
            outputs: [
                {
                    internalType: 'bytes32[]',
                    name: '',
                    type: 'bytes32[]',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'getRates',
            outputs: [
                {
                    internalType: 'uint256[]',
                    name: 'rates',
                    type: 'uint256[]',
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
            inputs: [
                {
                    internalType: 'bytes32',
                    name: 'currencyKey',
                    type: 'bytes32',
                },
            ],
            name: 'rateAndUpdatedTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'rate',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'time',
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
                    name: 'currencyKey',
                    type: 'bytes32',
                },
            ],
            name: 'rateForCurrency',
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
                    internalType: 'bytes32',
                    name: 'currencyKey',
                    type: 'bytes32',
                },
            ],
            name: 'removeAggregator',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default priceFeed;
