import Switch from 'components/SwitchInput/SwitchInputNew';
import { THALES_CURRENCY } from 'constants/currency';
import {
    StyledInfoIcon,
    StyledInfoIconGreen,
    StyledMaterialTooltip,
    Tip125Link,
    Tip17Link,
} from 'pages/Token/components';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { Line } from '../../components';
import YourTransactions from './Transactions';
import Stake from './Stake';
import Unstake from './Unstake';
import { isMobile } from 'utils/device';
import { GRID_GAP, GRID_GAP_MOBILE } from 'pages/Token/components/Tab/Tab';
import { getIsOVM } from 'utils/network';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import { StakingData, UserStakingData } from 'types/token';

function numberWithCommas(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getNumberLabel(label: number) {
    const labelValue = Number(label.toFixed(2));
    // Nine Zeroes for Billions
    return numberWithCommas(
        Math.abs(labelValue) >= 1.0e9
            ? Math.round(Math.abs(labelValue) / 1.0e9) + 'B'
            : // Six Zeroes for Millions
            Math.abs(labelValue) >= 1.0e6
            ? Math.round(Math.abs(labelValue) / 1.0e6) + 'M'
            : Math.abs(labelValue)
    );
}

const APR_FREQUENCY = 52;
const aprToApy = (interest: number) => ((1 + interest / 100 / APR_FREQUENCY) ** APR_FREQUENCY - 1) * 100;

const Staking: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isL2 = getIsOVM(networkId);

    const [lastValidStakingData, setLastValidStakingData] = useState<StakingData | undefined>(undefined);
    const [lastValidUserStakingData, setLastValidUserStakingData] = useState<UserStakingData | undefined>(undefined);

    const stakeOptions = {
        stake: { value: 'stake', label: t('options.earn.gamified-staking.staking.stake.name') },
        unstake: { value: 'unstake', label: t('options.earn.gamified-staking.staking.unstake.name') },
    };
    const [stakeOption, setStakeOption] = useState(stakeOptions.stake.value);

    const stakingDataQuery = useStakingDataQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            setLastValidStakingData(stakingDataQuery.data);
        }
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data]);

    const stakingData: StakingData | undefined = useMemo(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            return stakingDataQuery.data;
        }
        return lastValidStakingData;
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data, lastValidStakingData]);

    const userStakingDataQuery = useUserStakingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            setLastValidUserStakingData(userStakingDataQuery.data);
        }
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data]);

    const userStakingData: UserStakingData | undefined = useMemo(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            return userStakingDataQuery.data;
        }
        return lastValidUserStakingData;
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data, lastValidUserStakingData]);

    const totalStakedAmount = stakingData ? stakingData.totalStakedAmount : 0;
    const baseRewardsPool = stakingData ? stakingData.baseRewardsPool : 0;
    const totalEscrowedRewards = stakingData ? stakingData.totalEscrowedRewards : 0;
    const totalEscrowBalanceNotIncludedInStaking = stakingData ? stakingData.totalEscrowBalanceNotIncludedInStaking : 0;
    const maxBonusRewardsPercentage = stakingData ? stakingData.maxBonusRewardsPercentage : 0;

    const thalesStaked = userStakingData ? userStakingData.thalesStaked : 0;
    const escrowedBalance = userStakingData ? userStakingData.escrowedBalance : 0;
    const unstakingAmount = userStakingData ? userStakingData.unstakingAmount : 0;

    const APR = useMemo(
        () =>
            totalStakedAmount === 0
                ? 0
                : (Number(baseRewardsPool) * 52 * 100) /
                  (Number(totalStakedAmount) +
                      Number(totalEscrowedRewards) -
                      Number(totalEscrowBalanceNotIncludedInStaking)),
        [baseRewardsPool, totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const bonusAPR = useMemo(() => (APR * maxBonusRewardsPercentage) / 100, [APR]);
    const APY = useMemo(() => aprToApy(APR), [APR]);
    const formattedAPY = useMemo(() => getNumberLabel(aprToApy(APR)), [APR]);
    const apyWithBonus = useMemo(() => aprToApy(APR + bonusAPR), [APR, bonusAPR]);
    const formattedBonusAPY = useMemo(() => getNumberLabel(apyWithBonus - APY), [APY, apyWithBonus]);

    const totalThalesStaked = useMemo(
        () => totalStakedAmount + totalEscrowedRewards - totalEscrowBalanceNotIncludedInStaking,
        [totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(
        () => (totalThalesStaked === 0 ? 0 : (100 * (thalesStaked + escrowedBalance)) / totalThalesStaked),
        [thalesStaked, totalThalesStaked, escrowedBalance]
    );

    const getSectionLabel = (labelTransKey: string, defaultValue?: string, noIcon?: boolean) => {
        return (
            <SectionLabel>
                <SectionLabelContent>{t(labelTransKey, defaultValue)}</SectionLabelContent>
                {!noIcon && (
                    <StyledMaterialTooltip
                        arrow={true}
                        title={<Trans i18nKey={labelTransKey + '-tooltip'} />}
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                )}
            </SectionLabel>
        );
    };

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * baseRewardsPool, [myStakedShare]);
    const bonusEstimatedRewards = useMemo(() => (estimatedRewards * maxBonusRewardsPercentage) / 100, [
        estimatedRewards,
    ]);

    const notEligibleForStakingRewards = thalesStaked === 0 && escrowedBalance > 0;

    return (
        <>
            {/* First row */}
            <SectionWrapper>
                <SectionContentWrapper backgroundType={BackgroundType.INFO}>
                    {getSectionLabel('options.earn.gamified-staking.staking.apy', 'APY')}
                    <SectionValue>
                        <SectionValueContent>
                            {formattedAPY}%
                            <BonusInfo>
                                {' + ' + formattedBonusAPY}%
                                <StyledMaterialTooltip
                                    arrow={true}
                                    title={
                                        <Trans
                                            i18nKey={
                                                isL2
                                                    ? 'options.earn.gamified-staking.staking.bonus-apy-tooltip'
                                                    : 'options.earn.gamified-staking.staking.bonus-apy-tooltip-arb'
                                            }
                                            components={[
                                                <span key="1" />,
                                                isL2 ? <Tip17Link key="2" /> : <Tip125Link key="2" />,
                                            ]}
                                            values={{ max: maxBonusRewardsPercentage }}
                                        />
                                    }
                                    interactive
                                >
                                    <StyledInfoIconGreen />
                                </StyledMaterialTooltip>
                            </BonusInfo>
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper>
                <SectionContentWrapper backgroundType={BackgroundType.INFO}>
                    {getSectionLabel('options.earn.gamified-staking.staking.staked-share')}
                    <SectionValue>
                        <SectionValueContent>{formatCurrencyWithPrecision(myStakedShare)}%</SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* First and Second row */}
            <SectionWrapper rows={2} backgroundType={BackgroundType.INFO}>
                <SectionContentWrapper background={false}>
                    {getSectionLabel('options.earn.gamified-staking.staking.staked-balance')}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance + thalesStaked)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
                {notEligibleForStakingRewards && (
                    <StakedBalanceInfo>
                        {t('options.earn.gamified-staking.staking.not-eligible-message')}
                    </StakedBalanceInfo>
                )}
                <SectionContentWrapper background={false}>
                    <SectionDetails positionUp={true}>
                        <SectionDetailsLabel>
                            {t('options.earn.gamified-staking.staking.staked-directly')}
                        </SectionDetailsLabel>
                        <SectionDetailsValue unavailable={notEligibleForStakingRewards} floatNone={unstakingAmount > 0}>
                            {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                        </SectionDetailsValue>
                        {unstakingAmount > 0 && (
                            <UnstakingInfo>
                                {`${t(
                                    'options.earn.gamified-staking.staking.unstake.unstaking'
                                )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}`}
                            </UnstakingInfo>
                        )}
                    </SectionDetails>
                    <Line margin={isMobile() ? '3px 10px' : '0 15px'} />
                    <SectionDetails positionUp={false}>
                        <SectionDetailsLabel>
                            {t('options.earn.gamified-staking.staking.escrow-balance')}
                        </SectionDetailsLabel>
                        <SectionDetailsValue>
                            {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}
                        </SectionDetailsValue>
                    </SectionDetails>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Second row */}
            <SectionWrapper>
                <SectionContentWrapper backgroundType={BackgroundType.INFO}>
                    {getSectionLabel('options.earn.gamified-staking.staking.total-thales-staked')}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, totalThalesStaked)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper>
                <SectionContentWrapper backgroundType={BackgroundType.INFO}>
                    {getSectionLabel('options.earn.gamified-staking.staking.estimated-rewards', '', true)}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards)}
                            <BonusInfo>
                                {' + ' + formatCurrency(bonusEstimatedRewards)}
                                <StyledMaterialTooltip
                                    arrow={true}
                                    title={
                                        <Trans
                                            i18nKey="options.earn.gamified-staking.staking.bonus-estimated-rewards-tooltip"
                                            components={[
                                                <span key="1" />,
                                                isL2 ? <Tip17Link key="2" /> : <Tip125Link key="2" />,
                                            ]}
                                            values={{ max: maxBonusRewardsPercentage }}
                                        />
                                    }
                                    interactive
                                >
                                    <StyledInfoIconGreen />
                                </StyledMaterialTooltip>
                            </BonusInfo>
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Third row */}
            <SectionWrapper backgroundType={BackgroundType.STAKE}>
                <SectionContentWrapper>
                    <Switch
                        active={stakeOption !== stakeOptions.stake.value}
                        width={'94px'}
                        height={'32px'}
                        margin={'25px 0 10px 0'}
                        dotSize={'22px'}
                        label={{
                            firstLabel: stakeOptions.stake.label.toUpperCase(),
                            secondLabel: stakeOptions.unstake.label.toUpperCase(),
                            fontSize: '23px',
                        }}
                        shadow={true}
                        dotBackground={'var(--amm-switch-circle)'}
                        spanColumns={10}
                        handleClick={() => {
                            stakeOption === stakeOptions.stake.value
                                ? setStakeOption(stakeOptions.unstake.value)
                                : setStakeOption(stakeOptions.stake.value);
                        }}
                    />
                    {stakeOption === stakeOptions.stake.value && <Stake />}
                    {stakeOption === stakeOptions.unstake.value && <Unstake />}
                </SectionContentWrapper>
            </SectionWrapper>
            <YourTransactions />
        </>
    );
};

enum BackgroundType {
    INFO,
    STAKE,
}

const SectionWrapper = styled.section<{ columns?: number; rows?: number; backgroundType?: BackgroundType }>`
    box-sizing: border-box;
    border-radius: 15px;
    ${(props) =>
        props.rows
            ? `
                display: grid; 
                grid-template-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-gap: ${(isMobile() ? GRID_GAP_MOBILE : GRID_GAP) + 4}px;` // page GRID_GAP + borders(2 x 2px)
            : ''}
    grid-column: span ${(props) => (props.columns ? props.columns : 4)};
    grid-row: span ${(props) => (props.rows ? props.rows : 1)};
    background: ${(props) => {
        switch (props.backgroundType) {
            case BackgroundType.INFO:
                return props.theme.background.secondary;
            case BackgroundType.STAKE:
                return props.theme.background.secondary;
            default:
                return props.theme.background.secondary;
        }
    }};
    padding: 2px;
    @media (max-width: 768px) {
        grid-column: span ${(props) => (props.rows || props.backgroundType === BackgroundType.STAKE ? 12 : 6)};
        ${(props) => (props.backgroundType === BackgroundType.STAKE ? '' : 'background: #464dcf')};
    }
`;

const SectionContentWrapper = styled.div<{ background?: boolean; backgroundType?: BackgroundType }>`
    display: grid;
    height: 100%;
    background: ${(props) => (props.background ?? true ? ' var(--color-primary)' : 'none')};
    border-radius: 15px;
    align-items: center;
    @media (max-width: 768px) {
        ${(props) => (props.backgroundType === BackgroundType.INFO ? 'background: none' : '')};
    }
`;

const SectionLabel = styled.div`
    display: flex;
    padding: 10px 15px 5px 15px;
    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const SectionValue = styled.div`
    display: flex;
    padding: 5px 15px 10px 15px;
    align-items: center;
    @media (max-width: 768px) {
        padding: 0 10px 10px 10px;
    }
`;

const SectionContent = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    text-transform: uppercase;
    color: var(--color-white);
`;

const SectionLabelContent = styled(SectionContent)`
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    @media (max-width: 768px) {
        font-size: 12px;
        line-height: 12px;
    }
`;

const SectionValueContent = styled(SectionContent)`
    font-weight: 700;
    font-size: 23px;
    line-height: 30px;
    letter-spacing: 0.035em;
    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 20px;
        color: var(--color-highlight);
    }
`;

const SectionDetails = styled.div<{ positionUp: boolean }>`
    padding: ${(props) => (props.positionUp ? '15px 15px 5px 15px' : '5px 15px 15px 15px')};
    text-align: end;
    @media (max-width: 768px) {
        padding: ${(props) => (props.positionUp ? '10px 10px 0 10px' : '0 10px 10px 10px')};
    }
`;

const SectionDetailsLabel = styled.span`
    display: block;
    padding-top: 2px;
    float: left;
    font-weight: 300;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.035em;
    color: var(--color-white);
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const SectionDetailsValue = styled.span<{ unavailable?: boolean; floatNone?: boolean }>`
    display: inline-block;
    padding-top: 2px;
    float: ${(props) => (props.floatNone ? 'none' : 'right')};
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    color: ${(props) => (props.unavailable ? '#ffcc00' : 'var(--color-white)')};
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const BonusInfo = styled.span`
    color: #50ce99;
`;

const StakedBalanceInfo = styled.div`
    position: absolute;
    top: 80px;
    padding: 10px 15px;
    color: #ffcc00;
    font-size: 14px;
    @media (max-width: 768px) {
        padding: 10px;
        top: 130px;
        font-size: 12px;
    }
`;

const UnstakingInfo = styled.span`
    font-weight: 400;
    font-size: 12px;
    background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
    border-radius: 5px;
    padding: 3px 5px;
    margin-left: 5px;
    float: right;
`;

export default Staking;
