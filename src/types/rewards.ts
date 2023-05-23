export type Rewards = {
    account: string;
    itmInfo: {
        volume: number;
        percentage: number;
        rewards: {
            op: number;
            thales: number;
        };
    };
    otmInfo: {
        volume: number;
        percentage: number;
        rewards: {
            op: number;
            thales: number;
        };
    };
    totalRewards: {
        op: number;
        thales: number;
    };
    sticky: boolean;
};

export const emptyRewards: Rewards = {
    account: '',
    itmInfo: {
        volume: 0,
        percentage: 0,
        rewards: {
            op: 0,
            thales: 0,
        },
    },
    otmInfo: {
        volume: 0,
        percentage: 0,
        rewards: {
            op: 0,
            thales: 0,
        },
    },
    totalRewards: {
        op: 0,
        thales: 0,
    },
    sticky: false,
};
