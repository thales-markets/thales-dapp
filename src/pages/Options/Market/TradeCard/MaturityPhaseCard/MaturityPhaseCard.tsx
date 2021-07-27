import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import NetworkFees from 'pages/Options/components/NetworkFees';
import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/network';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { SYNTHS_MAP } from 'constants/currency';
import { ethers } from 'ethers';
import { TradeCardPhaseProps } from 'types/options';
import { useBOMContractContext } from 'pages/Options/Market/contexts/BOMContractContext';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import TimeRemaining from 'pages/Options/components/TimeRemaining/TimeRemaining';
import { RootState } from 'redux/rootReducer';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import ResultCard from '../components/ResultCard';
import { refetchMarketQueries } from 'utils/queryConnector';
import { BINARY_OPTIONS_EVENTS } from 'constants/events';
import MarketWidgetHeader from '../../components/MarketWidget/MarketWidgetHeader';
import { MarketWidgetKey } from 'constants/ui';
import MarketWidgetContent from '../../components/MarketWidget/MarketWidgetContent';
import ValidationMessage from 'components/ValidationMessage';
import {
    DefaultSubmitButton,
    Divider,
    SubmitButtonContainer,
    SummaryContent,
    SummaryItem,
    SummaryLabel,
} from '../../components';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
import { dispatchMarketNotification } from '../../../../../utils/options';

type MaturityPhaseCardProps = TradeCardPhaseProps;

const MaturityPhaseCard: React.FC<MaturityPhaseCardProps> = ({ optionsMarket, accountMarketInfo }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const BOMContract = useBOMContractContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isExercising, setIsExercising] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const { result } = optionsMarket;
    const longAmount = accountMarketInfo.long;
    const shortAmount = accountMarketInfo.short;
    const nothingToExercise = !longAmount && !shortAmount;
    const isLongResult = result === 'long';
    const isButtonDisabled = isExercising || !isWalletConnected || nothingToExercise || !gasLimit;

    useEffect(() => {
        if (walletAddress) {
            BOMContract.on(BINARY_OPTIONS_EVENTS.OPTIONS_EXERCISED, (account: string) => {
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                if (walletAddress === account) {
                    setIsExercising(false);
                }
            });
        }
        return () => {
            if (walletAddress) {
                BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.OPTIONS_EXERCISED);
            }
        };
    }, [walletAddress]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await BOMContractWithSigner.estimateGas.exerciseOptions();
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || nothingToExercise) return;
        fetchGasLimit();
    }, [isWalletConnected, nothingToExercise]);

    const handleExercise = async () => {
        try {
            setTxErrorMessage(null);
            setIsExercising(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
            const tx = (await BOMContractWithSigner.exerciseOptions()) as ethers.ContractTransaction;

            dispatch(
                addOptionsPendingTransaction({
                    optionTransaction: {
                        market: optionsMarket.address,
                        currencyKey: optionsMarket.currencyKey,
                        account: walletAddress,
                        hash: tx.hash || '',
                        type: 'exercise',
                        amount: isLongResult ? longAmount : shortAmount,
                        side: isLongResult ? 'long' : 'short',
                    },
                })
            );

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.market.trade-card.maturity.confirm-button.confirmation-message'));
                dispatch(
                    updateOptionsPendingTransactionStatus({
                        hash: txResult.transactionHash,
                        status: 'confirmed',
                    })
                );
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                setIsExercising(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsExercising(false);
        }
    };

    return (
        <>
            <MarketWidgetHeader widgetKey={MarketWidgetKey.MATURITY_PHASE}></MarketWidgetHeader>
            <MarketWidgetContent>
                <Container>
                    <InnerContainer>
                        <ResultCard
                            title={t('options.market.trade-card.maturity.card-title')}
                            subTitle={t('options.market.trade-card.maturity.card-subtitle')}
                            longAmount={longAmount}
                            shortAmount={shortAmount}
                            result={result}
                            exercised={nothingToExercise}
                        />
                        <MaturitySummaryContainer>
                            <SummaryItem>
                                <MaturitySummaryLabel>
                                    {t('options.market.trade-card.maturity.payout-amount-label')}
                                </MaturitySummaryLabel>
                                <MaturitySummaryContent>
                                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, isLongResult ? longAmount : shortAmount)}
                                </MaturitySummaryContent>
                            </SummaryItem>
                            <SummaryItem>
                                <MaturitySummaryLabel>
                                    {t('options.market.trade-card.maturity.end-label')}
                                </MaturitySummaryLabel>
                                <MaturitySummaryContent>
                                    <TimeRemaining
                                        end={optionsMarket.timeRemaining}
                                        onEnded={() =>
                                            refetchMarketQueries(
                                                walletAddress,
                                                BOMContract.address,
                                                optionsMarket.address
                                            )
                                        }
                                        fontSize={20}
                                    />
                                </MaturitySummaryContent>
                            </SummaryItem>
                        </MaturitySummaryContainer>
                        <Divider />
                        <NetworkFees gasLimit={gasLimit} />
                        <SubmitButtonContainer>
                            <DefaultSubmitButton disabled={isButtonDisabled} onClick={handleExercise}>
                                {nothingToExercise
                                    ? t('options.market.trade-card.maturity.confirm-button.success-label')
                                    : !isExercising
                                    ? t('options.market.trade-card.maturity.confirm-button.label')
                                    : t('options.market.trade-card.maturity.confirm-button.progress-label')}
                            </DefaultSubmitButton>
                        </SubmitButtonContainer>
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </InnerContainer>
                </Container>
            </MarketWidgetContent>
        </>
    );
};

const Container = styled(FlexDivCentered)`
    padding: 20px 30px;
`;

const InnerContainer = styled(FlexDivColumnCentered)`
    max-width: 600px;
`;

const MaturitySummaryContainer = styled.div`
    margin-top: 30px;
`;

const MaturitySummaryLabel = styled(SummaryLabel)`
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.15px;
`;

const MaturitySummaryContent = styled(SummaryContent)`
    font-size: 20px !important;
    line-height: 32px;
    letter-spacing: 0.15px;
`;

export default MaturityPhaseCard;
