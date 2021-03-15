import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import NetworkFees from 'pages/Options/components/NetworkFees';
import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/network';
import { ReactComponent as FinishIcon } from 'assets/images/finish.svg';
import { formatCurrencyWithSign } from 'utils/formatters';
import { USD_SIGN, SYNTHS_MAP } from 'constants/currency';
import { ethers } from 'ethers';
import { Button, Header, Message, Segment } from 'semantic-ui-react';
import { TradeCardPhaseProps } from 'types/options';
import { QueryClient } from 'react-query';
import { useBOMContractContext } from 'pages/Options/Market/contexts/BOMContractContext';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import TimeRemaining from 'pages/Options/components/TimeRemaining/TimeRemaining';
import QUERY_KEYS from 'constants/queryKeys';
import { RootState } from 'redux/rootReducer';
import {
    addOptionsPendingTransaction,
    updateOptionsPendingTransactionStatus,
} from 'redux/modules/optionsPendingTransactions';
import ResultCard from '../components/ResultCard';

const queryClient = new QueryClient();
type MaturityPhaseCardProps = TradeCardPhaseProps;

const MaturityPhaseCard: React.FC<MaturityPhaseCardProps> = ({ optionsMarket, accountMarketInfo }) => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const { t } = useTranslation();
    const BOMContract = useBOMContractContext();
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const [isExercising, setIsExercising] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const { balances, claimable } = accountMarketInfo;
    const { result } = optionsMarket;

    const longAmount = balances.long + claimable.long;
    const shortAmount = balances.short + claimable.short;
    const nothingToExercise = !longAmount && !shortAmount;
    const isLongResult = result === 'long';

    const buttonDisabled = isExercising || !isWalletConnected || nothingToExercise || !gasLimit;

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (!isWalletConnected) return;
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await BOMContractWithSigner.estimate.exerciseOptions();
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        fetchGasLimit();
    }, [isWalletConnected]);

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
                        amount: isLongResult ? balances.long : balances.short,
                        side: isLongResult ? 'long' : 'short',
                    },
                })
            );

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                dispatch(
                    updateOptionsPendingTransactionStatus({
                        hash: txResult.transactionHash,
                        status: 'confirmed',
                    })
                );
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
        } finally {
            setIsExercising(false);
        }
    };

    return (
        <Segment>
            <div style={{ marginBottom: 30 }}>
                <Header as="h3" style={{ textTransform: 'uppercase' }}>
                    {t('options.market.trade-card.maturity.title')}
                </Header>
            </div>
            <div>
                <ResultCard
                    icon={<FinishIcon />}
                    title={t('options.market.trade-card.maturity.card-title')}
                    subTitle={t('options.market.trade-card.maturity.card-subtitle')}
                    longAmount={longAmount}
                    shortAmount={shortAmount}
                    result={result}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Header as="h3" style={{ textTransform: 'uppercase' }}>
                    {t('options.market.trade-card.maturity.payout-amount')}
                </Header>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5, marginBottom: 20 }}>
                <Header as="h2">
                    {formatCurrencyWithSign(USD_SIGN, isLongResult ? longAmount : shortAmount)} {SYNTHS_MAP.sUSD}
                </Header>
            </div>
            <NetworkFees gasLimit={gasLimit} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button primary disabled={buttonDisabled} onClick={handleExercise}>
                    {nothingToExercise
                        ? t('options.market.trade-card.maturity.confirm-button.success-label')
                        : !isExercising
                        ? t('options.market.trade-card.maturity.confirm-button.label')
                        : t('options.market.trade-card.maturity.confirm-button.progress-label')}
                </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', textTransform: 'uppercase', marginTop: 20 }}>
                <span>
                    {t('options.market.trade-card.maturity.footer.end-label')}{' '}
                    <TimeRemaining
                        end={optionsMarket.timeRemaining}
                        onEnded={() =>
                            queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(optionsMarket.address))
                        }
                    />
                </span>
            </div>
        </Segment>
    );
};

export default MaturityPhaseCard;
