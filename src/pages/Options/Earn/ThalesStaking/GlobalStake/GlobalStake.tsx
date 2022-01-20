import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { FlexDivColumnCentered, FlexDivRow } from '../../../../../theme/common';
import styled from 'styled-components';
import { /*ClaimMessage, */ EarnSection, SectionHeader } from '../../components';
import { WEEKLY_REWARDS_THALES } from 'constants/token';

type GlobalStakeProps = {
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

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

const GlobalStake: React.FC<GlobalStakeProps> = ({
    thalesStaked,
    setThalesStaked,
    escrowedBalance,
    setEscrowedBalance,
}) => {
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
    const [fixedPeriodReward, setFixedPeriodReward] = useState<string>('0');
    const [totalStakedAmount, setTotalStakedAmount] = useState<string>('0');
    const [totalEscrowedRewards, setTotalEscrowedRewards] = useState<string>('0');
    const [totalEscrowBalanceNotIncludedInStaking, setTotalEscrowBalanceNotIncludedInStaking] = useState<string>('0');

    const APR = useMemo(
        () =>
            (Number(fixedPeriodReward) * 52 * 100) /
            (Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking)),
        [fixedPeriodReward, totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const APY = useMemo(() => getNumberLabel(Number(aprToApy(APR, 52).toFixed(2))), [APR]);

    const totalThalesStaked = useMemo(
        () => Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking),
        [totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(() => (100 * (Number(thalesStaked) + Number(escrowedBalance))) / totalThalesStaked, [
        thalesStaked,
        totalThalesStaked,
        escrowedBalance,
    ]);

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * WEEKLY_REWARDS_THALES, [myStakedShare]);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { thalesStaked, fixedPeriodReward, totalStakedAmount } = stakingThalesQuery.data;
            setThalesStaked(thalesStaked);
            setFixedPeriodReward(fixedPeriodReward);
            setTotalStakedAmount(totalStakedAmount);
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            const {
                escrowedBalance,
                totalEscrowedRewards,
                totalEscrowBalanceNotIncludedInStaking,
            } = escrowThalesQuery.data;
            setEscrowedBalance(escrowedBalance);
            setTotalEscrowedRewards(totalEscrowedRewards);
            setTotalEscrowBalanceNotIncludedInStaking(totalEscrowBalanceNotIncludedInStaking);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess, stakingThalesQuery.data, escrowThalesQuery.data]);

    // const notEligibleForStakingRewards = useMemo(() => {
    //     return !+thalesStaked && !!+escrowedBalance;
    // }, [thalesStaked, escrowedBalance]);

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={2}
            orderOnTablet={2}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                {t('options.earn.thales-staking.my-stake.global-staking-stats')}
                <RewardsInfo>
                    APR: {APR.toFixed(2)}%&nbsp;&nbsp;&nbsp;&nbsp;APY: {APY}%
                </RewardsInfo>
            </SectionHeader>
            <Container>
                <TopRow>
                    <StakeItem>
                        <StakeLabel>{t('options.earn.thales-staking.my-stake.my-staked-share')}</StakeLabel>
                        <StakeInfo>{myStakedShare.toFixed(2)}%</StakeInfo>
                    </StakeItem>
                    <StakeItem>
                        <StakeLabel>{t('options.earn.thales-staking.my-stake.estimated-rewards')}</StakeLabel>
                        <StakeInfo>{formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards)}</StakeInfo>
                    </StakeItem>
                </TopRow>
                <StakeItem>
                    <StakeLabel>{t('options.earn.thales-staking.my-stake.total-thales-staked')}</StakeLabel>
                    <StakeInfo style={{ fontSize: '25px' }}>
                        {formatCurrencyWithKey(THALES_CURRENCY, totalThalesStaked)}
                    </StakeInfo>
                    {/* {notEligibleForStakingRewards && (
                        <ClaimMessage>{t('options.earn.thales-staking.my-stake.not-eligible-message')}</ClaimMessage>
                    )} */}
                </StakeItem>
            </Container>
        </EarnSection>
    );
};

const Container = styled(FlexDivColumnCentered)`
    background: #04045a;
    border-radius: 15px;
    border: 1px solid rgba(100, 217, 254, 0.6);
`;

const TopRow = styled(FlexDivRow)`
    border-bottom: 1px solid rgba(100, 217, 254, 0.6);
`;

const StakeItem = styled(FlexDivColumnCentered)`
    justify-content: center;
    text-align: center;
    padding: 10px;
    &:first-child {
        border-right: 1px solid rgba(100, 217, 254, 0.6);
    }
`;

const StakeLabel = styled.span`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #b8c6e5;
`;

const StakeInfo = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
`;

const RewardsInfo = styled.span`
    font-weight: normal;
    font-size: 18px;
    > * {
        &:nth-child(2) {
            padding-left: 20px;
        }
    }
    @media (max-width: 767px) {
        font-size: 14px;
        display: flex;
        > * {
            &:nth-child(2) {
                padding-left: 5px;
            }
        }
    }
    text-align: end;
`;

export default GlobalStake;
