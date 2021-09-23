import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn, FlexDivColumnCentered, GradientText } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import useVestingBalanceQuery from 'queries/walletBalances/useVestingBalanceQuery';
import { getIsAppReady } from 'redux/modules/app';
import { VestingInfo } from 'types/token';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { formatShortDateWithTime } from 'utils/formatters/date';
import {
    ButtonContainerBottom,
    EarnSection,
    PieChartCenterDiv,
    PieChartCenterText,
    PieChartContainer,
    SectionContentContainer,
    SectionHeader,
    LearnMore,
    StyledMaterialTooltip,
    ClaimMessage,
    StyledInfoIcon,
    TooltipLink,
} from '../../components';
import { refetchUserTokenTransactions, refetchVestingBalance } from 'utils/queryConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { dispatchMarketNotification } from 'utils/options';
import { LINKS } from 'constants/links';

const initialVestingInfo = {
    unlocked: 0,
    totalClaimed: 0,
    initialLocked: 0,
    startTime: 0,
    endTime: 0,
};

const RetroRewards: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [vestingInfo, setVestingInfo] = useState<VestingInfo>(initialVestingInfo);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isClaimAvailable = vestingInfo.unlocked > 0;

    const vestingQuery = useVestingBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
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
        if (vestingQuery.isSuccess && vestingQuery.data) {
            setVestingInfo(vestingQuery.data);
        }
    }, [vestingQuery.isSuccess, vestingQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const { vestingEscrowContract } = snxJSConnector as any;
            try {
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await vestingContractWithSigner.estimateGas.claim();
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || !isClaimAvailable) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable]);

    const handleClaimRetroRewards = async () => {
        if (isClaimAvailable && gasPrice !== null) {
            const { vestingEscrowContract } = snxJSConnector as any;

            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                const tx = await vestingContractWithSigner.claim({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.snx-stakers.confirmation-message'));
                    refetchVestingBalance(walletAddress, networkId);
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
            return [{ name: 'Locked', value: 100, color: '#748bc6' }];
        }
        return [
            { name: 'Unlocked', value: vestingInfo.unlocked, color: '#5EA0A0' },
            { name: 'Claimed', value: vestingInfo.totalClaimed, color: '#AFC171' },
            { name: 'Locked', value: locked, color: '#FFD9BA' },
        ];
    }, [vestingInfo, locked]);

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
        <EarnSection style={{ gridColumn: 'span 6' }}>
            <SectionHeader>
                <div>
                    {t('options.earn.snx-stakers.retro-rewards.title')}
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey="options.earn.snx-stakers.retro-rewards.info-tooltip"
                                components={[<div key="1" />, <span key="3" />, <EligibilityLink key="2" />]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </div>
            </SectionHeader>
            <SectionContentContainer>
                <PieChartContainer>
                    <InfoDiv>
                        <InfoLabel>{t('options.earn.snx-stakers.start-time')}</InfoLabel>
                        <InfoContent>
                            {vestingInfo.startTime > 0 && formatShortDateWithTime(vestingInfo.startTime)}
                        </InfoContent>
                    </InfoDiv>
                    <PieChart style={{ margin: 'auto' }} height={200} width={200}>
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
                            <Tooltip
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
                                    !vestingInfo.initialLocked
                                        ? '#748BC6'
                                        : 'linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)'
                                }`}
                                fontSize={17}
                                fontWeight={600}
                                style={{ marginBottom: '3px' }}
                            >
                                {formatCurrency(vestingInfo.initialLocked, 2, true)}
                            </GradientText>
                            <GradientText
                                gradient={`${
                                    !vestingInfo.initialLocked
                                        ? '#748BC6'
                                        : 'linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)'
                                }`}
                                fontSize={17}
                                fontWeight={600}
                            >
                                {THALES_CURRENCY}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </PieChartCenterDiv>
                    <LearnMore style={{ fontSize: '13px' }}>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={t('options.earn.snx-stakers.retro-rewards.learn-more-text') as string}
                        >
                            <span>{t('options.earn.snx-stakers.retro-rewards.learn-more')}</span>
                        </StyledMaterialTooltip>
                    </LearnMore>
                </PieChartContainer>
                <AmountsContainer>
                    <div>
                        <Dot backgroundColor="#5EA0A0" />
                        {t('options.earn.snx-stakers.unlocked')}:{' '}
                        <span className="bold">{formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}</span>
                    </div>
                    <div>
                        <Dot backgroundColor="#AFC171" />
                        {t('options.earn.snx-stakers.claimed')}:{' '}
                        <span className="bold">{formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.totalClaimed)}</span>
                    </div>
                    <div>
                        <Dot backgroundColor="#FFD9BA" />
                        {t('options.earn.snx-stakers.locked')}:{' '}
                        <span className="bold">{formatCurrencyWithKey(THALES_CURRENCY, locked)}</span>
                    </div>
                </AmountsContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainerBottom>
                    <Button
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                        onClick={handleClaimRetroRewards}
                    >
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
            </SectionContentContainer>
        </EarnSection>
    );
};

const InfoDiv = styled(FlexDivColumn)`
    padding-bottom: 10px;
    align-items: flex-start;
`;

const InfoLabel = styled.div`
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
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
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
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

const EligibilityLink: React.FC = () => {
    const { t } = useTranslation();
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.RetroUnlockEligibilitySheet}>
            {t('common.here')}
        </TooltipLink>
    );
};

export default RetroRewards;
