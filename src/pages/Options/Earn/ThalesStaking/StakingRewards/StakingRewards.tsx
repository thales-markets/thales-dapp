import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlexDivColumn, FlexDivColumnCentered, FlexDivSpaceBetween, GradientText } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useOngoingAirdropQuery from 'queries/walletBalances/useOngoingAirdropQuery';
import { ethers } from 'ethers';
import { StakingReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchOngoingAirdrop, refetchUserTokenTransactions } from 'utils/queryConnector';
import {
    ButtonContainer,
    ClaimMessage,
    EarnSection,
    LearnMore,
    PieChartCenterDiv,
    PieChartCenterText,
    PieChartContainer,
    SectionContentContainer,
    SectionHeader,
    StyledMaterialTooltip,
} from '../../components';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { Cell, Pie, PieChart } from 'recharts';
import styled from 'styled-components';
import { bigNumberFormatter } from '../../../../../utils/formatters/ethers';
import { dispatchMarketNotification } from 'utils/options';
import ComingSoon from 'components/ComingSoon';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import {
    MAX_SNX_STAKING_PERIOD,
    MAX_THALES_STAKING_PERIOD,
    WEEKLY_REWARDS_SNX,
    WEEKLY_REWARDS_THALES,
} from '../../../../../constants/token';

type Properties = {
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const StakingRewards: React.FC<Properties> = ({ escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [ongoingAirdrop, setOngoingAirdrop] = useState<StakingReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const layoutOptions = useMemo(() => {
        if (window.innerWidth < 768) {
            return { pieWidth: 200, pieHeight: 200, pieOuterRadius: 100, pieInnerRadius: 75, gradientFontSize: 19 };
        } else if (window.innerWidth < 1025) {
            return { pieWidth: 200, pieHeight: 200, pieOuterRadius: 100, pieInnerRadius: 75, gradientFontSize: 25 };
        }
        return { pieWidth: 300, pieHeight: 300, pieOuterRadius: 150, pieInnerRadius: 115, gradientFontSize: 25 };
    }, [window.innerWidth]);
    const { ongoingAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        ongoingAirdrop &&
        ongoingAirdrop.reward &&
        ongoingAirdrop.hasClaimRights &&
        !ongoingAirdrop.claimed &&
        !ongoingAirdrop.isClaimPaused;

    const ongoingAirdropQuery = useOngoingAirdropQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!ongoingAirdropContract,
    });

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );

    useEffect(() => {
        if (ongoingAirdropQuery.isSuccess && ongoingAirdropQuery.data) {
            setOngoingAirdrop(ongoingAirdropQuery.data);
        }
    }, [ongoingAirdropQuery.isSuccess, ongoingAirdropQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (ongoingAirdrop && ongoingAirdrop.reward) {
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
                        ongoingAirdrop.reward.index,
                        ongoingAirdrop.reward.rawBalance,
                        ongoingAirdrop.reward.proof
                    );
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable || !ongoingAirdropContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, ongoingAirdropContract]);

    const handleClaimOngoingAirdrop = async () => {
        setShowTooltip(false);
        if (isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward && gasPrice !== null) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    ongoingAirdrop.reward.index,
                    ongoingAirdrop.reward.rawBalance,
                    ongoingAirdrop.reward.proof,
                    {
                        gasPrice: gasPriceInWei(gasPrice),
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchOngoingAirdrop(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setOngoingAirdrop({
                        ...ongoingAirdrop,
                        claimed: true,
                    });
                    setEscrowedBalance(escrowedBalance + bigNumberFormatter(ongoingAirdrop.reward.rawBalance));
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const tokenStakingDisabled = process.env.REACT_APP_TOKEN_STAKING_DISABLED === 'true';

    const pieData = useMemo(() => {
        if (!isClaimAvailable) {
            return [{ name: 'No data', value: 100, color: '#748bc6' }];
        }
        return [
            {
                name: 'THALES',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward
                        ? ongoingAirdrop.reward.stakingBalance
                        : 0,
            },
            {
                name: 'SNX',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0,
                color: '#00D1FF',
            },
        ];
    }, [ongoingAirdrop]);

    const stakingBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.stakingBalance : 0;
    const snxBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0;
    const balance = isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.balance : 0;
    const previousBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.previousBalance : 0;

    return (
        <EarnSection orderOnMobile={4} orderOnTablet={4} style={{ gridColumn: 'span 7', gridRow: 'span 3' }}>
            <SectionHeader>
                <div>{t('options.earn.thales-staking.staking-rewards.title')}</div>
                <div>
                    {t('options.earn.thales-staking.staking-rewards.period')}:{' '}
                    {ongoingAirdrop ? (
                        <TimeRemaining end={ongoingAirdrop.closingDate} fontSize={20} showFullCounter />
                    ) : (
                        '-'
                    )}
                </div>
            </SectionHeader>
            <SectionContentContainer>
                <StyledPieChartContainer>
                    <ThalesStakedDiv>
                        <StakingRewardsAmountContainer
                            marginRight={30}
                            gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        >
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-thales')}
                                </StakingRewardsTitle>
                                {tokenStakingDisabled ? (
                                    <GradientText
                                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                        fontSize={18}
                                        fontWeight={600}
                                        style={{ lineHeight: '22px' }}
                                    >
                                        {t('common.coming-soon')}
                                    </GradientText>
                                ) : (
                                    <GradientText
                                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                        fontSize={layoutOptions.gradientFontSize}
                                        fontWeight={600}
                                    >
                                        {formatCurrencyWithKey(THALES_CURRENCY, stakingBalance)}
                                    </GradientText>
                                )}
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                        {tokenStakingDisabled ? (
                            <div style={{ marginRight: '20px', marginTop: '50px' }}>
                                <ComingSoon />
                            </div>
                        ) : (
                            <>
                                <PeriodInfo>
                                    <StakingRewardsInfoTitle>
                                        {t('options.earn.thales-staking.staking-rewards.period')}:
                                    </StakingRewardsInfoTitle>
                                    <StakingRewardsInfoContent>
                                        {ongoingAirdrop ? `${ongoingAirdrop.period}/${MAX_THALES_STAKING_PERIOD}` : '-'}
                                    </StakingRewardsInfoContent>
                                </PeriodInfo>
                                <PeriodInfo>
                                    <StakingRewardsInfoTitle>
                                        {t('options.earn.thales-staking.staking-rewards.weekly-rewards')}:
                                    </StakingRewardsInfoTitle>
                                    <StakingRewardsInfoContent>
                                        {formatCurrencyWithKey(THALES_CURRENCY, WEEKLY_REWARDS_THALES, 0, true)}
                                    </StakingRewardsInfoContent>
                                </PeriodInfo>
                            </>
                        )}
                    </ThalesStakedDiv>
                    <StyledPieChart height={layoutOptions.pieHeight} width={layoutOptions.pieWidth}>
                        <defs>
                            <linearGradient
                                id={`thalesGradient`}
                                gradientTransform="translate(1, 0) rotate(200) scale(0.6)"
                            >
                                <stop offset="0%" stopColor={'#3936C7'} />
                                <stop offset="100%" stopColor={'#2D83D2'} />
                            </linearGradient>
                        </defs>
                        <Pie
                            isAnimationActive={false}
                            blendStroke={true}
                            data={pieData}
                            dataKey={'value'}
                            outerRadius={layoutOptions.pieOuterRadius}
                            innerRadius={layoutOptions.pieInnerRadius}
                            startAngle={-270}
                            endAngle={90}
                        >
                            {pieData.map((slice, index) => (
                                <Cell key={index} fill={slice.color || 'url(#thalesGradient)'} />
                            ))}
                        </Pie>
                    </StyledPieChart>
                    <SnxStakedDiv>
                        <StakingRewardsAmountContainer marginLeft={30} gradient="#00D1FF">
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-snx')}
                                </StakingRewardsTitle>
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={layoutOptions.gradientFontSize}
                                    fontWeight={600}
                                >
                                    {formatCurrencyWithKey(THALES_CURRENCY, snxBalance)}
                                </GradientText>
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                        <PeriodInfo>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.period')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {ongoingAirdrop ? `${ongoingAirdrop.period}/${MAX_SNX_STAKING_PERIOD}` : '-'}
                            </StakingRewardsInfoContent>
                        </PeriodInfo>
                        <PeriodInfo>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.weekly-rewards')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {formatCurrencyWithKey(THALES_CURRENCY, WEEKLY_REWARDS_SNX, 0, true)}
                            </StakingRewardsInfoContent>
                        </PeriodInfo>
                    </SnxStakedDiv>
                    <StyledPieChartCenterDiv>
                        <FlexDivColumnCentered>
                            <PieChartCenterText>
                                {t('options.earn.thales-staking.staking-rewards.total')}
                            </PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, balance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                        <FlexDivColumnCentered style={{ marginTop: 30, marginBottom: 30 }}>
                            <PieChartCenterText>
                                {t('options.earn.thales-staking.staking-rewards.previous-period')}
                            </PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, previousBalance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </StyledPieChartCenterDiv>
                    <LearnMore top="30%">
                        <StyledMaterialTooltip
                            enterTouchDelay={1}
                            arrow={true}
                            title={t('options.earn.thales-staking.staking-rewards.learn-more-text') as string}
                        >
                            <span>{t('options.earn.thales-staking.staking-rewards.learn-more')}</span>
                        </StyledMaterialTooltip>
                    </LearnMore>
                </StyledPieChartContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainer>
                    <StyledMaterialTooltip
                        arrow={true}
                        title={t('options.earn.thales-staking.staking-rewards.button-tooltip') as string}
                        open={showTooltip}
                    >
                        <Button
                            onMouseOver={() => {
                                setShowTooltip(true);
                            }}
                            onMouseOut={() => {
                                setShowTooltip(false);
                            }}
                            onClick={handleClaimOngoingAirdrop}
                            disabled={!isClaimAvailable || isClaiming}
                            className="primary"
                        >
                            {isClaiming
                                ? t('options.earn.thales-staking.staking-rewards.claiming') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                                : t('options.earn.thales-staking.staking-rewards.claim') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                        </Button>
                    </StyledMaterialTooltip>
                    {ongoingAirdrop && ongoingAirdrop.isClaimPaused && (
                        <ClaimMessage>{t('options.earn.thales-staking.staking-rewards.paused-message')}</ClaimMessage>
                    )}
                    {ongoingAirdrop && !ongoingAirdrop.isClaimPaused && !ongoingAirdrop.hasClaimRights && (
                        <ClaimMessage>
                            {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                        </ClaimMessage>
                    )}
                    {ongoingAirdrop &&
                        ongoingAirdrop.hasClaimRights &&
                        !ongoingAirdrop.isClaimPaused &&
                        ongoingAirdrop.claimed && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.claimed-message')}
                            </ClaimMessage>
                        )}
                </ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const StyledPieChart = styled(PieChart)`
    @media (max-width: 767px) {
        display: flex;
        flex-basis: 100%;
        justify-content: center;
    }
`;

const StakingRewardsAmountContainer = styled.div<{ gradient: string; marginRight?: number; marginLeft?: number }>`
    position: relative;
    background: ${(props) => props.gradient};
    border-radius: 15px;
    margin-bottom: 20px;
    margin-right: ${(props) => props.marginRight ?? '0'}px;
    margin-left: ${(props) => props.marginLeft ?? '0'}px;
    @media (max-width: 767px) {
        margin-right: 0;
        margin-left: 0;
    }
`;

const StakingRewardsAmount = styled(FlexDivColumn)`
    position: relative;
    background: #04045a;
    margin: 2px;
    border-radius: 15px;
    padding: 10px;
    text-align: center;
`;

const StakingRewardsTitle = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 10px;
    @media (max-width: 767px) {
        font-size: 13px;
        padding-bottom: 3px;
    }
`;

const StakingRewardsInfoTitle = styled.div`
    padding-top: 15px;
    font-size: 16px;
    line-height: 24px;
    flex: 1;
    width: 65%;
    @media (max-width: 767px) {
        width: 100%;
        text-align: center;
        padding-top: 10px;
    }
`;

const StakingRewardsInfoContent = styled.div`
    padding-top: 15px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    width: 35%;
    text-align: end;
    @media (max-width: 767px) {
        width: 100%;
        text-align: center;
        padding-top: 0;
    }
`;

const StyledPieChartContainer = styled(PieChartContainer)`
    align-items: flex-end;
    margin-bottom: 77px;
    @media (max-width: 767px) {
        flex-wrap: wrap;
        flex-direction: row;
        margin-bottom: 30px;
    }
`;

const ThalesStakedDiv = styled(FlexDivColumn)`
    margin-right: 30px;
    align-self: center;
    @media (max-width: 1024px) {
        margin-right: 10px;
    }
    @media (max-width: 767px) {
        flex-basis: 45%;
        order: 1;
        margin: 2%;
        margin-top: 20px;
        max-width: 45%;
    }
`;

const SnxStakedDiv = styled(FlexDivColumn)`
    margin-left: 30px;
    align-self: center;
    @media (max-width: 1024px) {
        margin-left: 10px;
    }
    @media (max-width: 767px) {
        flex-basis: 45%;
        order: 2;
        margin: 2%;
        margin-top: 20px;
        max-width: 45%;
    }
`;

const StyledPieChartCenterDiv = styled(PieChartCenterDiv)`
    @media (max-width: 1024px) {
        top: 0;
        transform: translate(-50%, 75px);
        > * {
            &:nth-child(2) {
                display: none;
            }
        }
    }
`;

const PeriodInfo = styled(FlexDivSpaceBetween)`
    @media (max-width: 767px) {
        flex-direction: column;
        text-align: center;
    }
`;

export default StakingRewards;
