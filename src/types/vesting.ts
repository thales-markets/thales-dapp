export type VestingInfo = {
    startTime: Date;
    endTime: Date;
    initialLocked: number;
    totalClaimed: number;
    unlocked: number;
};
