import Switch from 'components/SwitchInput/SwitchInput';
import Tooltip from 'components/Tooltip/Tooltip';
import { THALES_CURRENCY } from 'constants/currency';
import { STYLE_GRID_GAP, STYLE_GRID_GAP_MOBILE } from 'constants/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { Tip125Link, Tip17Link } from 'pages/Token/styled-components';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { StakingData, UserStakingData } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { getIsOVM } from 'utils/network';
import { Line } from '../../styled-components';
import Stake from './Stake';
import YourTransactions from './Transactions';
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

const APR_FREQUENCY = 52;
const aprToApy = (interest: number) => ((1 + interest / 100 / APR_FREQUENCY) ** APR_FREQUENCY - 1) * 100;

const Staking: React.FC = () => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

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

    const isL2 = getIsOVM(networkId);

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
                {!noIcon && <Tooltip overlay={t(labelTransKey + '-tooltip')} mobileIconFontSize={11} />}
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
                                <Tooltip
                                    overlay={
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
                                    iconColor={theme.textColor.quaternary}
                                    iconFontSize={22}
                                    mobileIconFontSize={12}
                                    top={-1}
                                />
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
                    <Line margin={isMobile ? '3px 10px' : '0 15px'} />
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
                                <Tooltip
                                    overlay={
                                        <Trans
                                            i18nKey="options.earn.gamified-staking.staking.bonus-estimated-rewards-tooltip"
                                            components={[
                                                <span key="1" />,
                                                isL2 ? <Tip17Link key="2" /> : <Tip125Link key="2" />,
                                            ]}
                                            values={{ max: maxBonusRewardsPercentage }}
                                        />
                                    }
                                    iconColor={theme.textColor.quaternary}
                                    iconFontSize={22}
                                    mobileIconFontSize={12}
                                    top={-1}
                                />
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
                        borderColor={theme.borderColor.primary}
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
                grid-gap: ${STYLE_GRID_GAP + 4}px;` // page GRID_GAP + borders(2 x 2px)
            : ''}
    grid-column: span ${(props) => (props.columns ? props.columns : 4)};
    grid-row: span ${(props) => (props.rows ? props.rows : 1)};
    background: ${(props) => props.theme.background.secondary};
    padding: 2px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        grid-column: span ${(props) => (props.rows || props.backgroundType === BackgroundType.STAKE ? 12 : 6)};
        ${(props) =>
            props.backgroundType === BackgroundType.STAKE ? '' : `background: ${props.theme.background.secondary}`};
        grid-gap: ${STYLE_GRID_GAP_MOBILE + 4}px;
    }
`;

const SectionContentWrapper = styled.div<{ background?: boolean; backgroundType?: BackgroundType }>`
    display: grid;
    height: 100%;
    background: ${(props) => (props.background ?? true ? props.theme.background.primary : 'none')};
    border-radius: 15px;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        ${(props) => (props.backgroundType === BackgroundType.INFO ? 'background: none' : '')};
    }
`;

const SectionLabel = styled.div`
    display: flex;
    padding: 10px 15px 5px 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px;
    }
`;

const SectionValue = styled.div`
    display: flex;
    padding: 5px 15px 10px 15px;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0 10px 10px 10px;
    }
`;

const SectionContent = styled.span`
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

const SectionLabelContent = styled(SectionContent)`
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
        line-height: 12px;
    }
`;

const SectionValueContent = styled(SectionContent)`
    font-weight: 700;
    font-size: 23px;
    line-height: 30px;
    letter-spacing: 0.035em;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 15px;
        line-height: 20px;
    }
`;

const SectionDetails = styled.div<{ positionUp: boolean }>`
    padding: ${(props) => (props.positionUp ? '15px 15px 5px 15px' : '5px 15px 15px 15px')};
    text-align: end;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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
    color: ${(props) => (props.unavailable ? props.theme.warning.textColor.primary : props.theme.textColor.primary)};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 14px;
    }
`;

const BonusInfo = styled.span`
    color: ${(props) => props.theme.textColor.quaternary};
`;

const StakedBalanceInfo = styled.div`
    position: absolute;
    top: 80px;
    padding: 10px 15px;
    color: ${(props) => props.theme.warning.textColor.primary};
    font-size: 14px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px;
        top: 130px;
        font-size: 12px;
    }
`;

const UnstakingInfo = styled.span`
    font-weight: 400;
    font-size: 12px;
    background: ${(props) => props.theme.button.background.primary};
    color: ${(props) => props.theme.button.textColor.primary};
    border-radius: 5px;
    padding: 3px 5px;
    margin-left: 5px;
    float: right;
`;

export default Staking;
