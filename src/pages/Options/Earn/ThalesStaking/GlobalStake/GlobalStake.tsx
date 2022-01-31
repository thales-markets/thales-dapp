import React, { useMemo } from 'react';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { /*ClaimMessage, */ EarnSection, SectionHeader } from '../../components';
import { GridContainer, StakeInfoContent, StakeInfoItem, StakeInfoLabel } from '../../gridComponents';
import { FlexDivRowCentered } from 'theme/common';

function numberWithCommas(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getNumberLabel(labelValue: number) {
    // Nine Zeroes for Billions
    return numberWithCommas(
        Math.abs(Number(labelValue)) >= 1.0e9
            ? Math.round(Math.abs(Number(labelValue)) / 1.0e9) + 'B'
            : // Six Zeroes for Millions
            Math.abs(Number(labelValue)) >= 1.0e6
            ? Math.round(Math.abs(Number(labelValue)) / 1.0e6) + 'M'
            : Math.abs(Number(labelValue))
    );
}

const aprToApy = (interest: number, frequency: number) => ((1 + interest / 100 / frequency) ** frequency - 1) * 100;

const GlobalStake: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const thalesStaked =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.thalesStaked) : 0;
    const fixedPeriodReward =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.fixedPeriodReward) : 0;
    const totalStakedAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.totalStakedAmount) : 0;
    const escrowedBalance =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? Number(escrowThalesQuery.data.escrowedBalance) : 0;
    const totalEscrowedRewards =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? Number(escrowThalesQuery.data.totalEscrowedRewards) : 0;
    const totalEscrowBalanceNotIncludedInStaking =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data
            ? Number(escrowThalesQuery.data.totalEscrowBalanceNotIncludedInStaking)
            : 0;

    const APR = useMemo(
        () =>
            totalStakedAmount === 0
                ? 0
                : (Number(fixedPeriodReward) * 52 * 100) /
                  (Number(totalStakedAmount) +
                      Number(totalEscrowedRewards) -
                      Number(totalEscrowBalanceNotIncludedInStaking)),
        [fixedPeriodReward, totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const APY = useMemo(() => getNumberLabel(Number(aprToApy(APR, 52).toFixed(2))), [APR]);

    const totalThalesStaked = useMemo(
        () => Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking),
        [totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(
        () =>
            totalThalesStaked === 0 ? 0 : (100 * (Number(thalesStaked) + Number(escrowedBalance))) / totalThalesStaked,
        [thalesStaked, totalThalesStaked, escrowedBalance]
    );

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * Number(fixedPeriodReward), [myStakedShare]);

    // const notEligibleForStakingRewards = useMemo(() => {
    //     return !+thalesStaked && !!+escrowedBalance;
    // }, [thalesStaked, escrowedBalance]);

    return (
        <EarnSection
            spanOnTablet={10}
            orderOnMobile={2}
            orderOnTablet={2}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                {t('options.earn.thales-staking.my-stake.global-staking-stats')}
                <RewardsInfo>
                    <span style={{ marginRight: 15 }}>APR: {APR.toFixed(2)}%</span>
                    <span>APY: {APY}%</span>
                </RewardsInfo>
            </SectionHeader>
            <GridContainer>
                <StakeInfoItem>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.my-staked-share')}</StakeInfoLabel>
                    <StakeInfoContent>{myStakedShare.toFixed(2)}%</StakeInfoContent>
                </StakeInfoItem>
                <StakeInfoItem>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.estimated-rewards')}</StakeInfoLabel>
                    <StakeInfoContent>{formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards)}</StakeInfoContent>
                </StakeInfoItem>
                <StakeInfoItem style={{ gridColumn: 'span 12' }}>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.total-thales-staked')}</StakeInfoLabel>
                    <StakeInfoContent style={{ fontSize: '25px' }}>
                        {formatCurrencyWithKey(THALES_CURRENCY, totalThalesStaked)}
                    </StakeInfoContent>
                    {/* {notEligibleForStakingRewards && (
                        <ClaimMessage>{t('options.earn.thales-staking.my-stake.not-eligible-message')}</ClaimMessage>
                    )} */}
                </StakeInfoItem>
            </GridContainer>
        </EarnSection>
    );
};

const RewardsInfo = styled(FlexDivRowCentered)`
    font-weight: normal;
    font-size: 18px;
    text-align: end;
    margin-left: 10px;
    @media (max-width: 767px) {
        margin-left: 0;
        margin-top: 4px;
        font-size: 14px;
    }
`;

export default GlobalStake;
