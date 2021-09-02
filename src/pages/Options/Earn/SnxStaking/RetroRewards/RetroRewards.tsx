import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';
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
import { ButtonContainer, EarnSection, SectionContentContainer, SectionHeader } from '../../components';
import { refetchUserTokenTransactions, refetchVestingBalance } from 'utils/queryConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Options/components/NetworkFees';

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
                setIsClaiming(true);
                const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
                const tx = await vestingContractWithSigner.claim({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
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
        console.log('new data');
        return [
            { name: 'Unlocked', value: vestingInfo.unlocked, color: '#FFD9BA' },
            { name: 'Claimed', value: vestingInfo.totalClaimed, color: '#AFC171' },
            { name: 'Locked', value: locked, color: '#5EA0A0' },
        ];
    }, [vestingInfo, locked]);

    return (
        <EarnSection style={{ gridColumn: 'span 6' }}>
            <SectionHeader>{t('options.earn.snx-stakers.retro-rewards.title')}</SectionHeader>
            <SectionContentContainer>
                <PieChartContainer>
                    <InfoDiv>
                        <InfoLabel>{t('options.earn.snx-stakers.start-time')}</InfoLabel>
                        <InfoContent>
                            {vestingInfo.startTime > 0 && formatShortDateWithTime(vestingInfo.startTime)}
                        </InfoContent>
                    </InfoDiv>
                    <PieChart height={250} width={250}>
                        <Pie
                            activeIndex={0}
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
                    </PieChart>
                    <InfoDiv style={{ alignItems: 'flex-end' }}>
                        <InfoLabel>{t('options.earn.snx-stakers.end-time')}</InfoLabel>
                        <InfoContent style={{ textAlign: 'right' }}>
                            {vestingInfo.endTime > 0 && formatShortDateWithTime(vestingInfo.endTime)}
                        </InfoContent>
                    </InfoDiv>
                    <PieChartCenterDiv>
                        <FlexDivColumnCentered>
                            <CenterText>{t('options.earn.snx-stakers.initial-locked')}</CenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.initialLocked, 0, true)}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </PieChartCenterDiv>
                </PieChartContainer>
                <AmountsContainer>
                    <div>
                        <Dot backgroundColor="#FFD9BA" />
                        {t('options.earn.snx-stakers.unlocked')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}
                    </div>
                    <div>
                        <Dot backgroundColor="#AFC171" />
                        {t('options.earn.snx-stakers.claimed')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.totalClaimed)}
                    </div>
                    <div>
                        <Dot backgroundColor="#5EA0A0" />
                        {t('options.earn.snx-stakers.locked')}: {formatCurrencyWithKey(THALES_CURRENCY, locked)}
                    </div>
                </AmountsContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainer>
                    <Button
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                        onClick={handleClaimRetroRewards}
                    >
                        {isClaiming
                            ? t('options.earn.snx-stakers.claiming-unlocked')
                            : t('options.earn.snx-stakers.claim-unlocked')}
                    </Button>
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
    padding: 10px 0 30px 0;
    justify-content: space-between;
`;

const PieChartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const PieChartCenterDiv = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const CenterText = styled.span`
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    text-align: center;
    margin-bottom: 5px;
`;

export default RetroRewards;
