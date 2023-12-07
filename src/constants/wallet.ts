import { ParticalTypes } from 'types/wallet';

export const SUPPORTED_PARTICAL_CONNECTORS: ParticalTypes[] = [
    ParticalTypes.GOOGLE,
    ParticalTypes.TWITTER,
    ParticalTypes.DISCORD,
    ParticalTypes.GITHUB,
    ParticalTypes.APPLE,
];

export const PARTICAL_LOGINS_CLASSNAMES: { socialId: ParticalTypes; className: string }[] = [
    {
        socialId: ParticalTypes.APPLE,
        className: 'social-icon icon--apple',
    },
    {
        socialId: ParticalTypes.DISCORD,
        className: 'social-icon icon--discord',
    },
    {
        socialId: ParticalTypes.GITHUB,
        className: 'social-icon icon--github',
    },
    {
        socialId: ParticalTypes.GOOGLE,
        className: 'social-icon icon--google',
    },
    {
        socialId: ParticalTypes.TWITTER,
        className: 'social-icon icon--x',
    },
];
