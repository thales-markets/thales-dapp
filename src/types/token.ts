import { TokenTabEnum, TokenTabSectionIdEnum } from 'enums/token';
import { ReactElement } from 'react';

export type VestingInfo = {
    startTime: number;
    endTime: number;
    initialLocked: number;
    totalClaimed: number;
    unlocked: number;
};

type TokenTransactionType =
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

export type TokenTabSection = {
    tab: TokenTabEnum;
    id: TokenTabSectionIdEnum;
    title: string;
    description: string | ReactElement;
    warning?: string | ReactElement;
    isButton: boolean;
};

export type TokenTransactions = TokenTransaction[];

type VestingScheduleItem = {
    date: number;
    amount: number | string;
};

export type VestingSchedule = VestingScheduleItem[];

export type UserVestingData = {
    claimable: number;
    rawClaimable: string;
    vestingSchedule: VestingSchedule;
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
