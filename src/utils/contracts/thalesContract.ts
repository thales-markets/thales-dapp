import { Network } from 'utils/network';

export const thalesContract = {
    addresses: {
        [Network.Mainnet]: '0x8947da500Eb47F82df21143D0C01A29862a8C3c5',
        [Network.Ropsten]: 'TBD',
        [Network.Rinkeby]: 'TBD',
        [Network.Kovan]: '0x8e801fb67436dae72af6eeb50e3f70d50019530f',
        // added to resolve error with typings
        [Network.Goerli]: '', // TODO: goerli network remove or implement
        [Network['Mainnet-Ovm']]: '0x217D47011b23BB961eB6D93cA9945B7501a5BB11',
        [Network['Kovan-Ovm']]: '0xf584fF99F97B5ABB1872af1AA7924Fedf3e1b53d',
        [Network['POLYGON-MUMBAI']]: 'TBD',
        [Network['POLYGON-MAINNET']]: 'TBD',
        [Network.BSC]: 'TBD',
        [Network.Arbitrum]: 'TBD',
    },
    abi: [
        {
            inputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'owner',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'spender',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Approval',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'to',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Transfer',
            type: 'event',
        },
        {
            constant: true,
            inputs: [
                {
                    internalType: 'address',
                    name: 'owner',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'spender',
                    type: 'address',
                },
            ],
            name: 'allowance',
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
                    name: 'spender',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'approve',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
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
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'balanceOf',
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
            name: 'decimals',
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
            constant: false,
            inputs: [
                {
                    internalType: 'address',
                    name: 'spender',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'subtractedValue',
                    type: 'uint256',
                },
            ],
            name: 'decreaseAllowance',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
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
                    name: 'spender',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'addedValue',
                    type: 'uint256',
                },
            ],
            name: 'increaseAllowance',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [
                {
                    internalType: 'string',
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'symbol',
            outputs: [
                {
                    internalType: 'string',
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'totalSupply',
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
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'transfer',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
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
                    name: 'sender',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'transferFrom',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default thalesContract;
