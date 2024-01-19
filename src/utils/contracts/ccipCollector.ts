import { Network } from 'enums/network';

const CCIPCollector = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.OptimismMainnet]: 'TBD',
        [Network.OptimismGoerli]: 'TBD',
        [Network.PolygonMainnet]: 'TBD',
        [Network.Arbitrum]: 'TBD',
        [Network.Base]: '0x25f29136801b0Eac63C586FFD249B49F1d96DB9c',
    },
    abi: [
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'router',
                    type: 'address',
                },
            ],
            name: 'InvalidRouter',
            type: 'error',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'currentBalance',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'calculatedFees',
                    type: 'uint256',
                },
            ],
            name: 'NotEnoughBalance',
            type: 'error',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: 'chainId',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'collectorAddress',
                    type: 'address',
                },
            ],
            name: 'CollectorForChainSet',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'masterCollector',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint64',
                    name: 'materCollectorChainId',
                    type: 'uint64',
                },
            ],
            name: 'MasterCollectorSet',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'bytes32',
                    name: 'messageId',
                    type: 'bytes32',
                },
                {
                    indexed: true,
                    internalType: 'uint64',
                    name: 'sourceChainSelector',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'sender',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                },
            ],
            name: 'MessageReceived',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'bytes32',
                    name: 'messageId',
                    type: 'bytes32',
                },
                {
                    indexed: true,
                    internalType: 'uint64',
                    name: 'destinationChainSelector',
                    type: 'uint64',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'receiver',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'text',
                    type: 'bytes',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'feeToken',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fees',
                    type: 'uint256',
                },
            ],
            name: 'MessageSent',
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
                    internalType: 'uint256',
                    name: '_toPeriod',
                    type: 'uint256',
                },
            ],
            name: 'PeriodManuallySet',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [],
            name: 'RemovedAllData',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_totalStakedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_totalEscrowedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_bonusPoints',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_revShare',
                    type: 'uint256',
                },
            ],
            name: 'SentOnClosePeriod',
            type: 'event',
        },
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
            name: 'SetAddressManager',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_router',
                    type: 'address',
                },
            ],
            name: 'SetCCIPRouter',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_gasLimitUsed',
                    type: 'uint256',
                },
            ],
            name: 'SetGasLimit',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_baseRewardsPerPeriod',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_extraRewardsPerPeriod',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_weeklyDecreaseFactor',
                    type: 'uint256',
                },
            ],
            name: 'SetPeriodRewards',
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
            inputs: [],
            name: 'baseRewardsPerPeriod',
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
            name: 'broadcastMessageToAll',
            outputs: [],
            stateMutability: 'nonpayable',
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
            name: 'calculatedBonusPointsForPeriod',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'calculatedEscrowedAmountForPeriod',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'calculatedRevenueForPeriod',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'calculatedStakedAmountForPeriod',
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
                    components: [
                        {
                            internalType: 'bytes32',
                            name: 'messageId',
                            type: 'bytes32',
                        },
                        {
                            internalType: 'uint64',
                            name: 'sourceChainSelector',
                            type: 'uint64',
                        },
                        {
                            internalType: 'bytes',
                            name: 'sender',
                            type: 'bytes',
                        },
                        {
                            internalType: 'bytes',
                            name: 'data',
                            type: 'bytes',
                        },
                        {
                            components: [
                                {
                                    internalType: 'address',
                                    name: 'token',
                                    type: 'address',
                                },
                                {
                                    internalType: 'uint256',
                                    name: 'amount',
                                    type: 'uint256',
                                },
                            ],
                            internalType: 'struct Client.EVMTokenAmount[]',
                            name: 'destTokenAmounts',
                            type: 'tuple[]',
                        },
                    ],
                    internalType: 'struct Client.Any2EVMMessage',
                    name: 'message',
                    type: 'tuple',
                },
            ],
            name: 'ccipReceive',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainBaseRewardsInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainBonusPointsInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainEscrowedAmountInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainExtraRewardsInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainRevenueInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainRevenueShareInPeriod',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainSelector',
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
            inputs: [
                {
                    internalType: 'uint64',
                    name: '',
                    type: 'uint64',
                },
            ],
            name: 'chainSelectorIndex',
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
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'chainStakedAmountInPeriod',
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
            name: 'collectedResultsForPeriod',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'collectorAddress',
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
            name: 'extraRewardsPerPeriod',
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
            name: 'gasLimitUsed',
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
            name: 'getChainSelectorForLastMessage',
            outputs: [
                {
                    internalType: 'uint64',
                    name: 'chainSelector_',
                    type: 'uint64',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'getRouter',
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
            name: 'initNonReentrant',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_router',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: '_masterCollector',
                    type: 'bool',
                },
                {
                    internalType: 'uint64',
                    name: '_masterCollectorSelector',
                    type: 'uint64',
                },
                {
                    internalType: 'uint64',
                    name: '_localChainSelector',
                    type: 'uint64',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'isMasterCollector',
            outputs: [
                {
                    internalType: 'bool',
                    name: 'isMaster',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
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
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'lastPeriodForChain',
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
            name: 'localChainSelector',
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
            name: 'masterCollector',
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
            name: 'masterCollectorChain',
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
            inputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'messageIdAlreadyReceived',
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
            name: 'messagesReceived',
            outputs: [
                {
                    internalType: 'bytes',
                    name: '',
                    type: 'bytes',
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
            name: 'messagesReceivedFromChainSelector',
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
            name: 'numOfActiveCollectors',
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
            name: 'numOfMessagesReceived',
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
            inputs: [],
            name: 'period',
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
            name: 'readyToBroadcast',
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
            name: 'resetAllData',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_toPeriod',
                    type: 'uint256',
                },
            ],
            name: 'resetPeriod',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_totalStakedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_totalEscrowedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_bonusPoints',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_revShare',
                    type: 'uint256',
                },
            ],
            name: 'sendOnClosePeriod',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_totalStakedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_totalEscrowedLastPeriodEnd',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_bonusPoints',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_revShare',
                    type: 'uint256',
                },
            ],
            name: 'sendOnClosePeriodAdmin',
            outputs: [],
            stateMutability: 'nonpayable',
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
                    internalType: 'address',
                    name: '_router',
                    type: 'address',
                },
            ],
            name: 'setCCIPRouter',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint64',
                    name: '_chainId',
                    type: 'uint64',
                },
                {
                    internalType: 'address',
                    name: '_collectorAddress',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_slot',
                    type: 'uint256',
                },
            ],
            name: 'setCollectorForChain',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_gasLimitUsed',
                    type: 'uint256',
                },
            ],
            name: 'setGasLimit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_masterCollector',
                    type: 'address',
                },
                {
                    internalType: 'uint64',
                    name: '_materCollectorChainId',
                    type: 'uint64',
                },
                {
                    internalType: 'uint64',
                    name: '_localChainSelector',
                    type: 'uint64',
                },
            ],
            name: 'setMasterCollector',
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
                    internalType: 'uint256',
                    name: '_baseRewardsPerPeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_extraRewardsPerPeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_weeklyDecreaseFactor',
                    type: 'uint256',
                },
            ],
            name: 'setPeriodRewards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes4',
                    name: 'interfaceId',
                    type: 'bytes4',
                },
            ],
            name: 'supportsInterface',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'pure',
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
            inputs: [],
            name: 'weeklyRewardsDecreaseFactor',
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
            stateMutability: 'payable',
            type: 'receive',
        },
    ],
};

export default CCIPCollector;
