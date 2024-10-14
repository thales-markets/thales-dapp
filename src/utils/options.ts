import { Positions } from 'enums/options';
import { Contract } from 'ethers';
import { formatCurrency } from 'thales-utils';
import { ThemeInterface } from 'types/ui';
import { DEPRECATED_CONTRACT_ADDRESSES, MARKET_DURATION_IN_DAYS } from '../constants/options';
import { Network } from '../enums/network';
import { Phase } from '../types/options';

export const getPhaseAndEndDate = (
    maturityDate: number,
    expiryDate: number
): { phase: Phase; timeRemaining: number } => {
    const now = Date.now();

    if (maturityDate > now) {
        return {
            phase: 'trading',
            timeRemaining: maturityDate,
        };
    }

    if (expiryDate > now) {
        return {
            phase: 'maturity',
            timeRemaining: expiryDate,
        };
    }

    return {
        phase: 'expiry',
        timeRemaining: expiryDate,
    };
};

export const convertPriceImpactToBonus = (priceImpact: number): number => -((priceImpact / (1 + priceImpact)) * 100);

export const getFormattedBonus = (bonus: number | undefined) => `+${formatCurrency(Number(bonus))}%`;

export const getColorPerPosition = (position: Positions, theme: ThemeInterface) => {
    switch (position) {
        case Positions.UP:
            return theme.positionColor.up;
        case Positions.DOWN:
            return theme.positionColor.down;
        case Positions.IN:
            return theme.positionColor.in;
        case Positions.OUT:
            return theme.positionColor.out;
        default:
            return theme.textColor.primary;
    }
};

export const isOptionClaimable = (positionBalance: any) =>
    (positionBalance.position.side === 'long' && positionBalance.position.market.result === 0) ||
    (positionBalance.position.side === 'short' && positionBalance.position.market.result === 1) ||
    (positionBalance.position.side === 'in' && positionBalance.position.market.result === 0) ||
    (positionBalance.position.side === 'out' && positionBalance.position.market.result === 1);

export const getMinMaturityDateForClaim = () =>
    Math.round(new Date(new Date().setDate(new Date().getDate() - MARKET_DURATION_IN_DAYS)).getTime() / 1000);

export const getContractForInteraction = (
    networkId: number,
    isDeprecatedCurrency: boolean,
    deprecatedContract: Contract | undefined,
    newContract: Contract | undefined
) => (networkId === Network.OptimismMainnet && !isDeprecatedCurrency ? newContract : deprecatedContract);

export const getIsDeprecatedCurrency = (networkId: number, address: string) =>
    networkId === Network.OptimismMainnet && DEPRECATED_CONTRACT_ADDRESSES.includes(address.toLowerCase());
