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
            10: '0x43318DE9E8f65b591598F17aDD87ae7247649C83',
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

export enum VaultTransaction {
    TRADES_HISTORY = 'trades-hisotry',
    USER_TRANSACTIONS = 'user-transactions',
}
