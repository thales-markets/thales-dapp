import Switch from 'components/SwitchInput/SwitchInputNew';
import { THALES_CURRENCY } from 'constants/currency';
import { StyledInfoIcon, StyledMaterialTooltip, Tip17Link } from 'pages/Token/components2';
import useEscrowThalesQuery from 'queries/staking/useEscrowThalesQuery';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { Line } from '../../components2';
import YourTransactions from '../../GamifiedStaking/Transactions';
import Stake from './Stake';
import Unstake from './Unstake';

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

const Staking: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const stakeOptions = {
        stake: { value: 'stake', label: t('options.earn.gamified-staking.staking.stake.name') },
        unstake: { value: 'unstake', label: t('options.earn.gamified-staking.staking.unstake.name') },
    };
    const [stakeOption, setStakeOption] = useState(stakeOptions.stake.value);
    const [thalesBalance, setThalesBalance] = useState(0);

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

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

    const getSectionLabel = (labelTransKey: string, defaultValue?: string) => {
        return (
            <SectionLabel>
                <SectionLabelContent>{t(labelTransKey, defaultValue)}</SectionLabelContent>
                <StyledMaterialTooltip arrow={true} title={<Trans i18nKey={labelTransKey + '-tooltip'} />} interactive>
                    <StyledInfoIcon />
                </StyledMaterialTooltip>
            </SectionLabel>
        );
    };

    return (
        <>
            {/* First row */}
            <SectionWrapper>
                <SectionContentWrapper>
                    {getSectionLabel('options.earn.gamified-staking.staking.apy', 'APY')}
                    <SectionValue>
                        <SectionValueContent>
                            {formattedAPY}
                            <BonusInfo>+</BonusInfo>
                            <BonusInfo>{formattedBonusAPY}%</BonusInfo>
                        </SectionValueContent>
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
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper>
                <SectionContentWrapper>
                    {getSectionLabel('options.earn.gamified-staking.staking.total-thales-staked')}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, totalThalesStaked)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* First and Second row */}
            <SectionWrapper rows={2} border={false}>
                <SectionContentWrapper background={false}>
                    {getSectionLabel('options.earn.gamified-staking.staking.staked-balance')}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance + thalesStaked)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
                <SectionContentWrapper background={false}>
                    <SectionDetails positionUp={true}>
                        <SectionDetailsLabel>
                            {t('options.earn.gamified-staking.staking.staked-directly')}
                        </SectionDetailsLabel>
                        <SectionDetailsValue>
                            {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                        </SectionDetailsValue>
                    </SectionDetails>
                    <Line margin={'0 15px'} />
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
                <SectionContentWrapper>
                    {getSectionLabel('options.earn.gamified-staking.staking.wallet-balance')}
                    <SectionValue>
                        <SectionValueContent>
                            {formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper>
                <SectionContentWrapper>
                    {getSectionLabel('options.earn.gamified-staking.staking.staked-share')}
                    <SectionValue>
                        <SectionValueContent>{formatCurrencyWithPrecision(myStakedShare)}%</SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Third row */}
            <SectionWrapper>
                <SectionContentWrapper>
                    <Switch
                        active={stakeOption !== stakeOptions.stake.value}
                        width={'94px'}
                        height={'32px'}
                        margin={'80px 0 40px 0'}
                        dotSize={'22px'}
                        label={{
                            firstLabel: stakeOptions.stake.label.toUpperCase(),
                            secondLabel: stakeOptions.unstake.label.toUpperCase(),
                            fontSize: '25px',
                        }}
                        shadow={true}
                        dotBackground={'var(--amm-switch-circle)'}
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

const SectionWrapper = styled.section<{ columns?: number; rows?: number; border?: boolean }>`
    box-sizing: border-box;
    border-radius: 15px;
    ${(_props) =>
        _props.rows ? 'display: grid; grid-template-columns: 1fr; grid-auto-rows: 1fr; grid-gap: 24px;' : ''}
    grid-column: span ${(_props) => (_props.columns ? _props.columns : 4)};
    grid-row: span ${(_props) => (_props.rows ? _props.rows : 1)};
    background: ${(_props) =>
        _props.border ?? true
            ? 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)'
            : 'linear-gradient(-20deg, #1BAB9C 0%, #4B6DC5 47.77%, #801BF2 100%)'};
    padding: 2px;
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    display: grid;
    background: ${(_props) => (_props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
`;

const SectionLabel = styled.div`
    display: flex;
    padding-bottom: 10px;
    padding-left: 15px;
`;

const SectionValue = styled.div`
    display: flex;
    padding-bottom: 10px;
    padding-left: 15px;
`;

const SectionContent = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    text-transform: uppercase;
    color: #ffffff;
`;

const SectionLabelContent = styled(SectionContent)`
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
    padding-top: 10px;
`;

const SectionValueContent = styled(SectionContent)`
    font-weight: 700;
    font-size: 30px;
    line-height: 30px;
    letter-spacing: 0.035em;
    padding-top: 10px;
`;

const SectionDetails = styled.div<{ positionUp: boolean }>`
    padding: ${(_props) => (_props.positionUp ? '20px 15px 0 15px' : '0 15px 20px 15px')};
`;

const SectionDetailsLabel = styled.span`
    display: block;
    float: left;
    font-weight: 300;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.035em;
    color: #ffffff;
`;

const SectionDetailsValue = styled.span`
    display: block;
    float: right;
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    color: #ffffff;
`;

const BonusInfo = styled.span`
    margin-left: 10px;
    color: #50ce99;
`;

export default Staking;
