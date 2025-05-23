import { Network } from 'enums/network';

const sportVaultDataContract = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.OptimismMainnet]: '0x70164a1ec9D21c4dBA2b4f9B23750F9C7D03286b',
        [Network.OptimismSepolia]: 'TBD',
        [Network.PolygonMainnet]: 'TBD',
        [Network.Arbitrum]: '0x4A096E1d719A2087F5CAfB0839aa25B6dd6dB324',
        [Network.Base]: 'TBD',
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
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract AmmVault',
                    name: 'ammVault',
                    type: 'address',
                },
            ],
            name: 'getAmmVaultData',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'bool',
                            name: 'vaultStarted',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'maxAllowedDeposit',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'round',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'roundEndTime',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'availableAllocationNextRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'minDepositAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'maxAllowedUsers',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'usersCurrentlyInVault',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'canCloseCurrentRound',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'paused',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'utilizationRate',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'priceLowerLimit',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'priceUpperLimit',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int256',
                            name: 'skewImpactLimit',
                            type: 'int256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'allocationLimitsPerMarketPerRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'minTradeAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'roundLength',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'allocationCurrentRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'allocationNextRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'lifetimePnl',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'allocationSpentInARound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'tradingAllocation',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct AmmVaultData.VaultData',
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
                    internalType: 'contract AmmVault',
                    name: 'ammVault',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
            ],
            name: 'getUserAmmVaultData',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'balanceCurrentRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'balanceNextRound',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'withdrawalRequested',
                            type: 'bool',
                        },
                    ],
                    internalType: 'struct AmmVaultData.UserVaultData',
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

export default sportVaultDataContract;
