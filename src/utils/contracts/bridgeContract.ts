import { NetworkId } from '@synthetixio/contracts-interface';

export const bridgeContract = {
    addresses: {
        [NetworkId.Mainnet]: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
        [NetworkId.Ropsten]: 'TBD',
        [NetworkId.Rinkeby]: 'TBD',
        [NetworkId.Kovan]: '0x22F24361D548e5FaAfb36d1437839f080363982B',
        // added to resolve error with typings
        [NetworkId.Goerli]: 'TBD', // TODO: goerli network remove or implement
        [NetworkId['Mainnet-Ovm']]: 'TBD',
        [NetworkId['Kovan-Ovm']]: 'TBD',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_l1Token',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_l2Token',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_from',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_to',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: '_data',
                    type: 'bytes',
                },
            ],
            name: 'ERC20DepositInitiated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_l1Token',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_l2Token',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: '_from',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_to',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: '_data',
                    type: 'bytes',
                },
            ],
            name: 'ERC20WithdrawalFinalized',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_l1Token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_l2Token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint32',
                    name: '_l2Gas',
                    type: 'uint32',
                },
                {
                    internalType: 'bytes',
                    name: '_data',
                    type: 'bytes',
                },
            ],
            name: 'depositERC20',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_l1Token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_l2Token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_to',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint32',
                    name: '_l2Gas',
                    type: 'uint32',
                },
                {
                    internalType: 'bytes',
                    name: '_data',
                    type: 'bytes',
                },
            ],
            name: 'depositERC20To',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_l1Token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_l2Token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_from',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_to',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: '_data',
                    type: 'bytes',
                },
            ],
            name: 'finalizeERC20Withdrawal',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'l2TokenBridge',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default bridgeContract;
