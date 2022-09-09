import Switch from 'components/SwitchInput/SwitchInputNew';
import { THALES_CURRENCY } from 'constants/currency';
import { StyledInfoIcon, StyledInfoIconGreen, StyledMaterialTooltip, Tip17Link } from 'pages/Token/components';
import useEscrowThalesQuery from 'queries/staking/useEscrowThalesQuery';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { Line } from '../../components';
import YourTransactions from './Transactions';
import Stake from './Stake';
import Unstake from './Unstake';
import { isMobile } from 'utils/device';
import { GRID_GAP, GRID_GAP_MOBILE } from 'pages/Token/components/Tab/Tab';

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

const aprToApy = (interest: number, frequency: number) => ((1 + interest / 100 / frequency) ** frequency - 1) * 100;

const Staking: React.FC<{ setEstimatedRewards: (estimatedRewards: number) => void }> = ({ setEstimatedRewards }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakeOptions = {
        stake: { value: 'stake', label: t('options.earn.gamified-staking.staking.stake.name') },
        unstake: { value: 'unstake', label: t('options.earn.gamified-staking.staking.unstake.name') },
    };
    const [stakeOption, setStakeOption] = useState(stakeOptions.stake.value);

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const totalStakedAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.totalStakedAmount) : 0;
    const fixedPeriodReward =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.fixedPeriodReward) : 0;
    const totalEscrowedRewards =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? Number(escrowThalesQuery.data.totalEscrowedRewards) : 0;
    const totalEscrowBalanceNotIncludedInStaking =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data
            ? Number(escrowThalesQuery.data.totalEscrowBalanceNotIncludedInStaking)
            : 0;
    const maxBonusRewardsPercentage =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? stakingThalesQuery.data.maxBonusRewardsPercentage : 0;
    const thalesStaked =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.thalesStaked) : 0;
    const escrowedBalance =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? Number(escrowThalesQuery.data.escrowedBalance) : 0;
    const unstakingAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.unstakingAmount) : 0;

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

    const bonusAPR = useMemo(() => (APR * maxBonusRewardsPercentage) / 100, [APR]);
    const APY = useMemo(() => aprToApy(APR, 52), [APR]);
    const formattedAPY = useMemo(() => getNumberLabel(aprToApy(APR, 52)), [APR]);
    const apyWithBonus = useMemo(() => aprToApy(APR + bonusAPR, 52), [APR, bonusAPR]);
    const formattedBonusAPY = useMemo(() => getNumberLabel(apyWithBonus - APY), [APY, apyWithBonus]);

    const totalThalesStaked = useMemo(
        () => Number(totalStakedAmount) + Number(totalEscrowedRewards) - Number(totalEscrowBalanceNotIncludedInStaking),
        [totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(
        () =>
            totalThalesStaked === 0 ? 0 : (100 * (Number(thalesStaked) + Number(escrowedBalance))) / totalThalesStaked,
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

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * Number(fixedPeriodReward), [myStakedShare]);
    const bonusEstimatedRewards = useMemo(() => (estimatedRewards * maxBonusRewardsPercentage) / 100, [
        estimatedRewards,
    ]);

    useEffect(() => {
        setEstimatedRewards(bonusEstimatedRewards);
    }, [bonusEstimatedRewards, networkId]);

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
                                            i18nKey="options.earn.gamified-staking.staking.bonus-apy-tooltip"
                                            components={[<span key="1" />, <Tip17Link key="2" />]}
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
                        {unstakingAmount > 0 && (
                            <UnstakingInfo>
                                {`${t(
                                    'options.earn.gamified-staking.staking.unstake.unstaking'
                                )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}`}
                            </UnstakingInfo>
                        )}
                        <SectionDetailsValue unavailable={notEligibleForStakingRewards}>
                            {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                        </SectionDetailsValue>
                    </SectionDetails>
                    <Line margin={isMobile() ? '0 10px' : '0 15px'} />
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
                                            components={[<span key="1" />, <Tip17Link key="2" />]}
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
                return 'linear-gradient(-20deg, #1BAB9C 0%, #4B6DC5 47.77%, #801BF2 100%)';
            case BackgroundType.STAKE:
                return '#64d9fe80';
            default:
                return 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)';
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
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
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
    color: #ffffff;
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
        color: #64d9fe;
    }
`;

const SectionDetails = styled.div<{ positionUp: boolean }>`
    padding: ${(props) => (props.positionUp ? '15px 15px 5px 15px' : '5px 15px 15px 15px')};
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
    color: #ffffff;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const SectionDetailsValue = styled.span<{ unavailable?: boolean }>`
    display: block;
    padding-top: 2px;
    float: right;
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    color: ${(props) => (props.unavailable ? '#ffcc00' : '#ffffff')};
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const BonusInfo = styled.span`
    color: #50ce99;
`;

const StakedBalanceInfo = styled.div`
    position: absolute;
    top: 70px;
    padding: 10px 15px;
    color: #ffcc00;
    font-size: 14px;
    @media (max-width: 768px) {
        padding: 10px;
        top: 120px;
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
