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
    | 'vest'
    | 'lpStake'
    | 'lpUnstake'
    | 'lpClaimStakingRewards'
    | 'mergeAccount';

export type TokenTransaction = {
    hash: string;
    type: TokenTransactionType;
    account: string;
    timestamp: number;
    amount: number | string;
    blockNumber: number;
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
    CLAIM_MIGRATED_REWARDS = 'claimMigratedRewards',
    CLAIM_MIGRATED_RETRO_REWARDS = 'claimMigratedRetroRewards',
    LP_STAKE = 'lpStake',
    LP_UNSTAKE = 'lpUnstake',
    LP_CLAIM_STAKING_REWARDS = 'lpClaimStakingRewards',
    MERGE_ACCOUNT = 'mergeAccount',
}

export type TokenTransactions = TokenTransaction[];

export type VestingScheduleItem = {
    date: number;
    amount: number | string;
};

export type VestingSchedule = VestingScheduleItem[];

export type StakingReward = {
    closingDate: number;
    period: number;
    isClaimPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    canClosePeriod: boolean;
    baseRewardsPool: number;
    bonusRewardsPool: number;
    bonusRewardsPoolPercentage: number;
    rewards: number;
    baseRewards: number;
    totalBonus: number;
    snxBonus: number;
    ammBonus: number;
    thalesRoyaleBonus: number;
    maxSnxBonusPercentage: number;
    maxAmmBonusPercentage: number;
    maxThalesRoyaleBonusPercentage: number;
    maxSnxBonus: number;
    maxAmmBonus: number;
    maxThalesRoyaleBonus: number;
    ammVolumeRewardsMultiplier: number;
    snxVolumeRewardsMultiplier: number;
    snxStaked: number;
    ammVolume: number;
    hasParticipatedInCurrentOrLastRoyale: boolean;
};

type Reward = {
    balance: number;
    rawBalance: string;
    stakingBalance: number;
    snxBalance: number;
    previousBalance: number;
    index: number;
    proof: string[];
};

export type MigratedReward = {
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

type RetroReward = {
    balance: number;
    rawBalance: string;
    index: number;
    proof: string[];
};

export type MigratedRetroReward = {
    isClaimPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    reward?: RetroReward;
};
