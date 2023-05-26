import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, Tooltip as RechartsTooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useVestingBalanceQuery from 'queries/token/useVestingEscrowQuery';
import { getIsAppReady } from 'redux/modules/app';
import { VestingInfo } from 'types/token';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { formatShortDateWithTime } from 'utils/formatters/date';
import {
    ButtonContainerBottom,
    EarnSection,
    SectionHeader,
    ClaimMessage,
    SectionContentContainer,
} from '../components';
import { PieChartCenterDiv, PieChartCenterText, PieChartContainer, LearnMore, Tip37Link } from '../../components';
import { refetchUserTokenTransactions, refetchVestingEscrow } from 'utils/queryConnector';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { dispatchMarketNotification } from 'utils/options';
import { DEFAULT_LANGUAGE, SupportedLanguages } from 'i18n/config';
import i18n from 'i18n';
import { GridContainer } from 'pages/Token/SnxStaking/gridComponents';
import Tooltip from 'components/TooltipV2/Tooltip';
import Button from 'components/ButtonV2';
import { ThemeInterface } from 'types/ui';

const initialVestingInfo = {
    unlocked: 0,
    totalClaimed: 0,
    initialLocked: 0,
    startTime: 0,
    endTime: 0,
};

const RetroRewards: React.FC = () => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [vestingInfo, setVestingInfo] = useState<VestingInfo>(initialVestingInfo);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const { vestingEscrowContract } = snxJSConnector as any;
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);

    const isClaimAvailable = vestingInfo.unlocked > 0;

    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const vestingQuery = useVestingBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!vestingEscrowContract,
    });

    useEffect(() => {
        if (vestingQuery.isSuccess && vestingQuery.data) {
            setVestingInfo(vestingQuery.data);
        }
    }, [vestingQuery.isSuccess, vestingQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (vestingContractWithSigner: any) => {
            const txRequest = await vestingContractWithSigner.populateTransaction.claim();
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            const { vestingEscrowContract } = snxJSConnector as any;
            try {
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        vestingContractWithSigner.estimateGas.claim(),
                        fetchL1Fee(vestingContractWithSigner),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await vestingContractWithSigner.estimateGas.claim();
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || !isClaimAvailable) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable]);

    const handleClaimRetroRewards = async () => {
        if (isClaimAvailable) {
            const { vestingEscrowContract } = snxJSConnector as any;

            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                const tx = await vestingContractWithSigner.claim({
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.snx-stakers.confirmation-message'));
                    refetchVestingEscrow(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setVestingInfo({
                        ...vestingInfo,
                        unlocked: 0,
                        totalClaimed: vestingInfo.totalClaimed + vestingInfo.unlocked,
                    });
                    setIsClaiming(false);
                }
            } catch (e) {
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const locked = useMemo(() => {
        return vestingInfo.initialLocked - vestingInfo.unlocked - vestingInfo.totalClaimed;
    }, [vestingInfo]);

    const pieData = useMemo(() => {
        if (!vestingInfo.initialLocked) {
            return [{ name: 'Locked', value: 100, color: theme.textColor.secondary }];
        }
        return [
            {
                name: t('options.earn.snx-stakers.unlocked'),
                value: vestingInfo.unlocked,
                color: theme.textColor.quaternary,
            },
            {
                name: t('options.earn.snx-stakers.claimed'),
                value: vestingInfo.totalClaimed,
                color: theme.warning.textColor.primary,
            },
            { name: t('options.earn.snx-stakers.locked'), value: locked, color: theme.error.textColor.primary },
        ];
    }, [vestingInfo, locked, selectedLanguage]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <TooltipContainer borderColor={payload[0].payload.color}>
                    <TooltipTitle color={payload[0].payload.color}>{`${payload[0].name}:`}</TooltipTitle>
                    <TooltipAmount color={payload[0].payload.color}>
                        {formatCurrencyWithKey(THALES_CURRENCY, payload[0].value)}
                    </TooltipAmount>
                </TooltipContainer>
            );
        }
        return null;
    };

    return (
        <EarnSection
            style={{ gridColumn: 'span 6', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                <div>
                    {t('options.earn.snx-stakers.retro-rewards.title')}
                    <Tooltip
                        overlay={
                            <Trans
                                i18nKey="options.earn.snx-stakers.retro-rewards.info-tooltip"
                                components={[<span key="1" />, <Tip37Link key="2" />]}
                            />
                        }
                        iconFontSize={18}
                        mobileIconFontSize={15}
                        top={-1}
                    />
                </div>
            </SectionHeader>
            <GridContainer style={{ gridGap: 0 }}>
                <StyledSectionContentContainer>
                    <PieChartContainer>
                        <InfoDiv>
                            <InfoLabel>{t('options.earn.snx-stakers.start-time')}</InfoLabel>
                            <InfoContent>
                                {vestingInfo.startTime > 0 && formatShortDateWithTime(vestingInfo.startTime)}
                            </InfoContent>
                        </InfoDiv>
                        <PieChart style={{ margin: 'auto', zIndex: 100 }} height={200} width={200}>
                            <Pie
                                isAnimationActive={false}
                                blendStroke={true}
                                data={pieData}
                                dataKey={'value'}
                                outerRadius={100}
                                innerRadius={75}
                            >
                                {pieData.map((slice, index) => (
                                    <Cell key={index} fill={slice.color} />
                                ))}
                            </Pie>
                            {!!vestingInfo.initialLocked && (
                                <RechartsTooltip
                                    wrapperStyle={{ zIndex: 1000 }}
                                    content={<CustomTooltip />}
                                    allowEscapeViewBox={{ x: true, y: true }}
                                />
                            )}
                        </PieChart>
                        <InfoDiv style={{ alignItems: 'flex-end' }}>
                            <InfoLabel>{t('options.earn.snx-stakers.end-time')}</InfoLabel>
                            <InfoContent style={{ textAlign: 'right' }}>
                                {vestingInfo.endTime > 0 && formatShortDateWithTime(vestingInfo.endTime)}
                            </InfoContent>
                        </InfoDiv>
                        <PieChartCenterDiv>
                            <FlexDivColumnCentered>
                                <PieChartCenterText disabled={!vestingInfo.initialLocked}>
                                    {t('options.earn.snx-stakers.initial-locked')}
                                </PieChartCenterText>
                                <GradientText
                                    gradient={`${
                                        !vestingInfo.initialLocked ? theme.textColor.secondary : theme.textColor.primary
                                    }`}
                                    fontSize={17}
                                    fontWeight={600}
                                    style={{ marginBottom: '3px' }}
                                >
                                    {formatCurrency(vestingInfo.initialLocked, 2, true)}
                                </GradientText>
                                <GradientText
                                    gradient={`${
                                        !vestingInfo.initialLocked ? theme.textColor.secondary : theme.textColor.primary
                                    }`}
                                    fontSize={17}
                                    fontWeight={600}
                                >
                                    {THALES_CURRENCY}
                                </GradientText>
                            </FlexDivColumnCentered>
                        </PieChartCenterDiv>
                        <LearnMore top="61%" style={{ fontSize: '13px' }}>
                            <Tooltip overlay={t('options.earn.snx-stakers.retro-rewards.learn-more-text')}>
                                <span>{t('options.earn.snx-stakers.retro-rewards.learn-more')}</span>
                            </Tooltip>
                        </LearnMore>
                    </PieChartContainer>
                    <AmountsContainer>
                        <div>
                            <Dot backgroundColor={theme.textColor.quaternary} />
                            {t('options.earn.snx-stakers.unlocked')}:{' '}
                            <span className="bold">{formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}</span>
                        </div>
                        <div>
                            <Dot backgroundColor={theme.warning.textColor.primary} />
                            {t('options.earn.snx-stakers.claimed')}:{' '}
                            <span className="bold">
                                {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.totalClaimed)}
                            </span>
                        </div>
                        <div>
                            <Dot backgroundColor={theme.error.textColor.primary} />
                            {t('options.earn.snx-stakers.locked')}:{' '}
                            <span className="bold">{formatCurrencyWithKey(THALES_CURRENCY, locked)}</span>
                        </div>
                    </AmountsContainer>
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                    <ButtonContainerBottom>
                        <Button disabled={!isClaimAvailable || isClaiming} onClick={handleClaimRetroRewards}>
                            {isClaiming
                                ? t('options.earn.snx-stakers.claiming-unlocked') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}...`
                                : t('options.earn.snx-stakers.claim') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}`}
                        </Button>
                        <ClaimMessage invisible={!!vestingInfo.initialLocked}>
                            {t('options.earn.snx-stakers.retro-rewards.not-eligible-message')}
                        </ClaimMessage>
                    </ButtonContainerBottom>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </StyledSectionContentContainer>
            </GridContainer>
        </EarnSection>
    );
};

const StyledSectionContentContainer = styled(SectionContentContainer)`
    grid-column: span 12;
    background: ${(props) => props.theme.background.primary};
    padding: 20px;
    @media (max-width: 767px) {
        padding: 0 20px 20px 20px;
    }
`;

const InfoDiv = styled(FlexDivColumn)`
    padding-bottom: 10px;
    align-items: flex-start;
`;

const InfoLabel = styled.div`
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    @media (max-width: 767px) {
        padding-top: 15px;
    }
`;

const InfoContent = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
`;

const Dot = styled.span<{ backgroundColor: string }>`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    background-color: ${(props) => props.backgroundColor};
`;

const AmountsContainer = styled(FlexDiv)`
    padding: 20px 0 30px 0;
    justify-content: space-between;
    @media (max-width: 1024px) {
        > * {
            text-align: center;
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        padding-top: 25px;
        padding-bottom: 25px;
        > * {
            padding: 15px;
        }
        flex-direction: column;
    }
`;

const TooltipContainer = styled(FlexDivColumnCentered)<{ borderColor: string }>`
    border: 3px solid ${(props) => props.borderColor};
    border-radius: 15px;
    z-index: 999;
    height: 78px;
    padding: 10px 14px;
    background: ${(props) => props.theme.background.primary};
`;

const TooltipAmount = styled(FlexDivColumn)<{ color: string }>`
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    letter-spacing: 0.15px;
    color: ${(props) => props.color};
`;

const TooltipTitle = styled.span<{ color: string }>`
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    color: ${(props) => props.color};
    margin-bottom: 10px;
`;

const GradientText = styled.span<{ gradient: string; fontSize: number; fontWeight: number }>`
    font-size: ${(props) => props.fontSize}px;
    font-weight: ${(props) => props.fontWeight};
    background: ${(props) => props.gradient};
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
`;

export default RetroRewards;
