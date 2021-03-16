import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import snxJSConnector from 'utils/snxJSConnector';
import { normalizeGasLimit } from 'utils/network';
import { ReactComponent as ClockIcon } from 'assets/images/clock.svg';
import QUERY_KEYS from 'constants/queryKeys';
import { useBOMContractContext } from '../../contexts/BOMContractContext';
import { ethers } from 'ethers';
import { TradeCardPhaseProps } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Header, Message, Segment } from 'semantic-ui-react';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import ResultCard from '../components/ResultCard';
import { QueryClient } from 'react-query';
import NetworkFees from 'pages/Options/components/NetworkFees';

const queryClient = new QueryClient();
type TradingPhaseCardProps = TradeCardPhaseProps;

const TradingPhaseCard: React.FC<TradingPhaseCardProps> = ({ optionsMarket, accountMarketInfo }) => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const { t } = useTranslation();
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const BOMContract = useBOMContractContext();

    const [isClaiming, setIsClaiming] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const { bids, balances, claimable } = accountMarketInfo;

    const nothingToClaim = !bids.short && !bids.long;
    const buttonDisabled = isClaiming || !isWalletConnected || nothingToClaim || !gasLimit;

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (!isWalletConnected) return;
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await BOMContractWithSigner.estimate.claimOptions();
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        fetchGasLimit();
    }, [isWalletConnected]);

    const handleClaim = async () => {
        try {
            setTxErrorMessage(null);
            setIsClaiming(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
            const tx = (await BOMContractWithSigner.claimOptions()) as ethers.ContractTransaction;

            const sharedPendingTxProps = {
                market: optionsMarket.address,
                currencyKey: optionsMarket.currencyKey,
                account: walletAddress,
            };

            if (claimable.long) {
                dispatch(
                    addOptionsPendingTransaction({
                        optionTransaction: {
                            ...sharedPendingTxProps,
                            hash: tx.hash || '',
                            type: 'claim',
                            amount: claimable.long,
                            side: 'long',
                        },
                    })
                );
            }

            if (claimable.short) {
                dispatch(
                    addOptionsPendingTransaction({
                        optionTransaction: {
                            ...sharedPendingTxProps,
                            hash: tx.hash || '',
                            type: 'claim',
                            amount: claimable.short,
                            side: 'short',
                        },
                    })
                );
            }

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
            setIsClaiming(false);
        }
    };

    return (
        <Segment>
            <div style={{ marginBottom: 30 }}>
                <Header as="h3" style={{ textTransform: 'uppercase' }}>
                    {t('options.market.trade-card.trading.title')}
                </Header>
            </div>
            <div>
                <ResultCard
                    icon={<ClockIcon />}
                    title={t('options.market.trade-card.trading.card-title')}
                    subTitle={t('options.market.trade-card.trading.card-subtitle')}
                    longAmount={balances.long}
                    shortAmount={balances.short}
                    longPrice={optionsMarket.longPrice}
                    shortPrice={optionsMarket.shortPrice}
                    claimableLongAmount={claimable.long}
                    claimableShortAmount={claimable.short}
                />
            </div>
            <NetworkFees gasLimit={gasLimit} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button primary disabled={buttonDisabled} onClick={handleClaim}>
                    {nothingToClaim
                        ? t('options.market.trade-card.trading.confirm-button.success-label')
                        : !isClaiming
                        ? t('options.market.trade-card.trading.confirm-button.label')
                        : t('options.market.trade-card.trading.confirm-button.progress-label')}
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', textTransform: 'uppercase', marginTop: 20 }}>
                <span>
                    {t('options.market.trade-card.trading.footer.end-label')}{' '}
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

export default TradingPhaseCard;
