import { Network } from 'enums/network';

export const VAULT_MAP: Record<string, any> = {
    'discount-vault': {
        addresses: {
            [Network.OptimismMainnet]: '0xb484027CB0c538538Bad2bE492714154f9196F93',
            [Network.Arbitrum]: '0x0A29CddbdAAf56342507574820864dAc967D2683',
        },
    },
    'degen-discount-vault': {
        addresses: {
            [Network.OptimismMainnet]: '0x43318DE9E8f65b591598F17aDD87ae7247649C83',
            [Network.Arbitrum]: '0x640c34D9595AD5351Da8c5C833Bbd1AfD20519ea',
        },
    },
    'safu-discount-vault': {
        addresses: {
            [Network.OptimismMainnet]: '0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F',
            [Network.Arbitrum]: '0x008A4e30A8b41781F5cb017b197aA9Aa4Cd53b46',
        },
    },
};
