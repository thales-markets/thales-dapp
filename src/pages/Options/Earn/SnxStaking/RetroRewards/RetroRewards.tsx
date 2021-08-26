import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn } from 'theme/common';
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
import { refetchVestingBalance } from 'utils/queryConnector';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { Divider } from 'pages/Options/Market/components';
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

    const locked = vestingInfo.initialLocked - vestingInfo.unlocked - vestingInfo.totalClaimed;

    return (
        <EarnSection style={{ gridColumn: 'span 10' }}>
            <SectionHeader>{t('options.earn.snx-stakers.retro-rewards.title')}</SectionHeader>
            <SectionContentContainer>
                <FlexDiv>
                    <RewardsInfoColumn>
                        <InfoDiv>
                            <InfoLabel>{t('options.earn.snx-stakers.start-time')}:</InfoLabel>
                            <InfoContent>
                                {vestingInfo.startTime > 0 && formatShortDateWithTime(vestingInfo.startTime)}
                            </InfoContent>
                        </InfoDiv>
                    </RewardsInfoColumn>
                    <RewardsInfoColumn>
                        <InfoDiv>
                            <InfoLabel>{t('options.earn.snx-stakers.end-time')}:</InfoLabel>
                            <InfoContent>
                                {vestingInfo.endTime > 0 && formatShortDateWithTime(vestingInfo.endTime)}
                            </InfoContent>
                        </InfoDiv>
                    </RewardsInfoColumn>
                    <RewardsInfoColumn>
                        <InfoDiv>
                            <InfoLabel>{t('options.earn.snx-stakers.initial-locked')}:</InfoLabel>
                            <InfoContent>
                                {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.initialLocked)}
                            </InfoContent>
                        </InfoDiv>
                    </RewardsInfoColumn>
                </FlexDiv>
                <AmountsContainer>
                    <div>
                        <Dot backgroundColor="#b6bce2" />
                        {t('options.earn.snx-stakers.unlocked')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.unlocked)}
                    </div>
                    <div>
                        <Dot backgroundColor="#3f51b5" />
                        {t('options.earn.snx-stakers.claimed')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, vestingInfo.totalClaimed)}
                    </div>
                    <div>
                        <Dot backgroundColor="#0a2e66" />
                        {t('options.earn.snx-stakers.locked')}: {formatCurrencyWithKey(THALES_CURRENCY, locked)}
                    </div>
                </AmountsContainer>
                <ProgressContainer>
                    <ProgressSlice
                        backgroundColor="#b6bce2"
                        width={(vestingInfo.unlocked * 100) / vestingInfo.initialLocked}
                    />
                    <ProgressSlice
                        backgroundColor="#3f51b5"
                        width={(vestingInfo.totalClaimed * 100) / vestingInfo.initialLocked}
                    />
                    <ProgressSlice backgroundColor="#0a2e66" width={(locked * 100) / vestingInfo.initialLocked} />
                </ProgressContainer>
                <Divider />
                <NetworkFeesContainer>
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                </NetworkFeesContainer>
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
    align-items: center;
`;

const InfoLabel = styled.div`
    padding-bottom: 10px;
    font-size: 16px;
`;

const InfoContent = styled.div``;

const ProgressSlice = styled.div<{ backgroundColor: string; width: number }>`
    height: 4px;
    display: inline-block;
    background-color: ${(props) => props.backgroundColor};
    width: ${(props) => props.width}%;
`;

const Dot = styled.span<{ backgroundColor: string }>`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    background-color: ${(props) => props.backgroundColor};
`;

const RewardsInfoColumn = styled(FlexDivColumn)`
    align-items: center;
    font-size: 16px !important;
`;

const AmountsContainer = styled(FlexDiv)`
    padding: 30px 0 10px 0;
    justify-content: space-between;
`;

const ProgressContainer = styled.div`
    margin-bottom: 20px;
`;

const NetworkFeesContainer = styled.div`
    padding: 0 350px;
`;

export default RetroRewards;
