import Button from 'components/Button';
import Tooltip from 'components/Tooltip/Tooltip';
import { THALES_CURRENCY } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import i18n from 'i18n';
import { DEFAULT_LANGUAGE, SupportedLanguages } from 'i18n/config';
import { GridContainer } from 'pages/Token/SnxStaking/gridComponents';
import useVestingBalanceQuery from 'queries/token/useVestingEscrowQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, Tooltip as RechartsTooltip } from 'recharts';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered } from 'styles/common';
import { VestingInfo } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { refetchUserTokenTransactions, refetchVestingEscrow } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import {
    LearnMore,
    PieChartCenterDiv,
    PieChartCenterText,
    PieChartContainer,
    Tip37Link,
} from '../../styled-components';
import {
    ButtonContainerBottom,
    ClaimMessage,
    EarnSection,
    SectionContentContainer,
    SectionHeader,
} from '../components';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { getMaxGasLimitForNetwork } from 'constants/options';

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
    const [vestingInfo, setVestingInfo] = useState<VestingInfo>(initialVestingInfo);
    const [isClaiming, setIsClaiming] = useState(false);
    const { vestingEscrowContract } = snxJSConnector as any;

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

    const handleClaimRetroRewards = async () => {
        if (isClaimAvailable) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            const { vestingEscrowContract } = snxJSConnector as any;

            try {
                setIsClaiming(true);
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                const tx = await vestingContractWithSigner.claim({
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('thales-token.snx-stakers.confirmation-message'), id));
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
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
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
                name: t('thales-token.snx-stakers.unlocked'),
                value: vestingInfo.unlocked,
                color: theme.textColor.quaternary,
            },
            {
                name: t('thales-token.snx-stakers.claimed'),
                value: vestingInfo.totalClaimed,
                color: theme.warning.textColor.primary,
            },
            { name: t('thales-token.snx-stakers.locked'), value: locked, color: theme.error.textColor.primary },
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
                    {t('thales-token.snx-stakers.retro-rewards.title')}
                    <Tooltip
                        overlay={
                            <Trans
                                i18nKey="thales-token.snx-stakers.retro-rewards.info-tooltip"
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
                            <InfoLabel>{t('thales-token.snx-stakers.start-time')}</InfoLabel>
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
                            <InfoLabel>{t('thales-token.snx-stakers.end-time')}</InfoLabel>
                            <InfoContent style={{ textAlign: 'right' }}>
                                {vestingInfo.endTime > 0 && formatShortDateWithTime(vestingInfo.endTime)}
                            </InfoContent>
                        </InfoDiv>
                        <PieChartCenterDiv>
                            <FlexDivColumnCentered>
                                <PieChartCenterText disabled={!vestingInfo.initialLocked}>
                                    {t('thales-token.snx-stakers.initial-locked')}
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
                            <Tooltip overlay={t('thales-token.snx-stakers.retro-rewards.learn-more-text')}>
                                <span>{t('thales-token.snx-stakers.retro-rewards.learn-more')}</span>
                            </Tooltip>
                        </LearnMore>
                    </PieChartContainer>
                    <AmountsContainer>
                        <div>
                            <Dot backgroundColor={theme.textColor.quaternary} />
                            {t('thales-token.snx-stakers.unlocked')}:{' '}
                            <Text>{formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}</Text>
                        </div>
                        <div>
                            <Dot backgroundColor={theme.warning.textColor.primary} />
                            {t('thales-token.snx-stakers.claimed')}:{' '}
                            <Text>{formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.totalClaimed)}</Text>
                        </div>
                        <div>
                            <Dot backgroundColor={theme.error.textColor.primary} />
                            {t('thales-token.snx-stakers.locked')}:{' '}
                            <Text>{formatCurrencyWithKey(THALES_CURRENCY, locked)}</Text>
                        </div>
                    </AmountsContainer>
                    <ButtonContainerBottom>
                        <Button disabled={!isClaimAvailable || isClaiming} onClick={handleClaimRetroRewards}>
                            {isClaiming
                                ? t('thales-token.snx-stakers.claiming-unlocked') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}...`
                                : t('thales-token.snx-stakers.claim') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}`}
                        </Button>
                        <ClaimMessage invisible={!!vestingInfo.initialLocked}>
                            {t('thales-token.snx-stakers.retro-rewards.not-eligible-message')}
                        </ClaimMessage>
                    </ButtonContainerBottom>
                </StyledSectionContentContainer>
            </GridContainer>
        </EarnSection>
    );
};

const StyledSectionContentContainer = styled(SectionContentContainer)`
    grid-column: span 12;
    background: ${(props) => props.theme.background.primary};
    padding: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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

const Text = styled.span`
    font-weight: bold;
`;

export default RetroRewards;
