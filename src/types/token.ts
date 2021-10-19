type AccountInfo = {
    balance: number;
    rawBalance: string;
    index: number;
    proof: string[];
};

export type Airdrop = {
    isClaimPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    accountInfo?: AccountInfo;
};

export type VestingInfo = {
    startTime: number;
    endTime: number;
    initialLocked: number;
    totalClaimed: number;
    unlocked: number;
};

export type TokenTransactionType =
    | 'claimRetroAirdrop'
    | 'claimRetroUnlocked'
    | 'claimStakingRewards'
    | 'stake'
    | 'cancelUnstake'
    | 'startUnstaking'
    | 'unstake'
    | 'addToEscrow'
    | 'vest';

export type TokenTransaction = {
    hash: string;
    type: TokenTransactionType;
    account: string;
    timestamp: number;
    amount: number | string;
};

export enum TransactionFilterEnum {
    ALL = 'all',
    CLAIM_RETRO_AIRDROP = 'claimRetroAirdrop',
    CLAIM_RETRO_UNLOCKED = 'claimRetroUnlocked',
    CLAIM_STAKING_REWARDS = 'claimStakingRewards',
    STAKE = 'stake',
    START_UNSTAKE = 'startUnstake',
    CANCEL_UNSTAKE = 'cancelUnstake',
    UNSTAKE = 'unstake',
    ADD_TO_ESCROW = 'addToEscrow',
    VEST = 'vest',
}

export type TokenTransactions = TokenTransaction[];

export type VestingScheduleItem = {
    date: number;
    amount: number | string;
};

export type VestingSchedule = VestingScheduleItem[];

type Reward = {
    balance: number;
    rawBalance: string;
    stakingBalance: number;
    snxBalance: number;
    previousBalance: number;
    index: number;
    proof: string[];
};

export type StakingReward = {
    closingDate: number;
    period: number;
    isClaimPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    reward?: Reward;
};

export type TokenInfo = {
    totalSupply: number;
    circulatingSupply: number;
    price?: number;
    marketCap?: number;
};
