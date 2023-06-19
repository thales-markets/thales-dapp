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
