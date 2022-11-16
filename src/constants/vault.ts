export enum VaultTab {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

export enum VaultTradeStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    WIN = 'WIN',
    LOSE = 'LOSE',
}

export const VAULT_MAP: Record<string, any> = {
    'discount-vault': {
        addresses: {
            5: '',
            10: '0xb484027CB0c538538Bad2bE492714154f9196F93',
            42: '',
            420: '',
        },
    },
    'degen-discount-vault': {
        addresses: {
            5: '',
            10: '0x9d3ABEAf22ddF68E72b865CA3b23ED880A3be41F',
            42: '',
            420: '',
        },
    },
    'safu-discount-vault': {
        addresses: {
            5: '',
            10: '0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F',
            42: '',
            420: '',
        },
    },
};
