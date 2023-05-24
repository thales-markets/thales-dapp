import { ReactElement } from 'react';

type AccountInfo = {
    balance: number;
    rawBalance: string;
    index: number;
    proof: string[];
};

export type Airdrop = {
    isPaused: boolean;
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
    | 'lpClaimStakingRewardsSecond'
    | 'mergeAccount'
    | 'delegateVolume'
    | 'removeDelegation';

export type TokenTransaction = {
    hash: string;
    type: TokenTransactionType;
    account: string;
    timestamp: number;
    amount: number | string;
    blockNumber: number;
    destAccount?: string;
};

export enum TokenTabEnum {
    GAMIFIED_STAKING = 'gamified-staking',
    LP_STAKING = 'lp-staking',
    MIGRATION = 'migration',
    STRATEGIC_INVESTORS = 'strategic-investors',
}

export enum TokenTabSectionIdEnum {
    STAKING = 'staking',
    REWARDS = 'rewards',
    VESTING = 'vesting',
    MERGE_ACCOUNT = 'account-preferences',
    LP_STAKING = 'lp-staking',
}

export type TokenTabSection = {
    tab: TokenTabEnum;
    id: TokenTabSectionIdEnum;
    title: string;
    description: string | ReactElement;
    warning?: string | ReactElement;
    isButton: boolean;
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
    LP_CLAIM_STAKING_REWARDS_SECOND = 'lpClaimStakingRewardsSecond',
    MERGE_ACCOUNT = 'mergeAccount',
    DELEGATE_VOLUME = 'delegateVolume',
    REMOVE_DELEGATION = 'removeDelegation',
}

export type TokenTransactions = TokenTransaction[];

export type VestingScheduleItem = {
    date: number;
    amount: number | string;
};

export type VestingSchedule = VestingScheduleItem[];

export type UserVestingData = {
    claimable: number;
    rawClaimable: string;
    vestingSchedule: VestingSchedule;
};

export type StakingReward = {
    closingDate: number;
    period: number;
    isPaused: boolean;
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
    thalesAmmVolume: number;
    rangedAmmVolume: number;
    sportsAmmVolume: number;
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
    isPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    reward?: Reward;
};

export type TokenInfo = {
    totalSupply: number;
    circulatingSupply: number;
    thalesBurned: number;
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
    isPaused: boolean;
    hasClaimRights: boolean;
    claimed: boolean;
    reward?: RetroReward;
};

export type StakingData = {
    period: number;
    unstakeDurationPeriod: number;
    closingDate: number;
    isPaused: boolean;
    baseRewardsPool: number;
    bonusRewardsPool: number;
    totalStakedAmount: number;
    maxSnxBonusPercentage: number;
    maxAmmBonusPercentage: number;
    maxThalesRoyaleBonusPercentage: number;
    maxBonusRewardsPercentage: number;
    snxVolumeRewardsMultiplier: number;
    ammVolumeRewardsMultiplier: number;
    canClosePeriod: boolean;
    mergeAccountEnabled: boolean;
    totalEscrowBalanceNotIncludedInStaking: number;
    totalEscrowedRewards: number;
};

export type UserStakingData = {
    thalesStaked: number;
    hasClaimRights: boolean;
    claimed: boolean;
    isUnstaking: boolean;
    lastUnstakeTime: number;
    unstakingAmount: number;
    delegatedVolume: string;
    rewards: number;
    baseRewards: number;
    totalBonus: number;
    snxBonus: number;
    ammBonus: number;
    maxSnxBonus: number;
    maxAmmBonus: number;
    maxThalesRoyaleBonus: number;
    snxStaked: number;
    ammVolume: number;
    thalesAmmVolume: number;
    rangedAmmVolume: number;
    sportsAmmVolume: number;
    escrowedBalance: number;
    claimable: number;
    rawClaimable: string;
    isUserLPing: boolean;
    isPaused: boolean;
    unstakeDurationPeriod: number;
    mergeAccountEnabled: boolean;
};
