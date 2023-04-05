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
            42161: '0x0A29CddbdAAf56342507574820864dAc967D2683',
        },
    },
    'degen-discount-vault': {
        addresses: {
            5: '',
            10: '0x43318DE9E8f65b591598F17aDD87ae7247649C83',
            42: '',
            420: '',
            42161: '0x640c34D9595AD5351Da8c5C833Bbd1AfD20519ea',
        },
    },
    'safu-discount-vault': {
        addresses: {
            5: '',
            10: '0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F',
            42: '',
            420: '',
            42161: '0x008A4e30A8b41781F5cb017b197aA9Aa4Cd53b46',
        },
    },
};

export enum VaultTransaction {
    TRADES_HISTORY = 'trades-hisotry',
    USER_TRANSACTIONS = 'user-transactions',
}
