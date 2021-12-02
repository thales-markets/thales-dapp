import { NetworkId } from '@synthetixio/contracts-interface';

export const priceFeedContract = {
    addresses: {
        [NetworkId.Mainnet]: 'TBD',
        [NetworkId.Ropsten]: '0x4a1e5AF88f39Ad09BC3fAc3563B77F4f8A55F3Da',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: '0x750dCAdcA8e9e7f9702c85383119ea8034450993',
        // added to resolve error with typings
        [NetworkId.Goerli]: '', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: '0x8FE726b27e89Cd484981B2D27160186920Af2d17',
        [NetworkId['Kovan-Ovm']]: '0x34fb310296b441625469395ed5765296F6426636',
    },
    abi: [
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
            name: 'initialize',
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

export default priceFeedContract;
