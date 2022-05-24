import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import Divider from '../AMM/styled-components/Divider';
import { Container, Header, Label, OptionsContainer, Icon } from './styled-components';
import Input from '../AMM/components/Input';
import NetworkFees from '../AMM/components/NetworkFees';
import Button from 'components/Button';
import TimeRemaining from 'components/TimeRemaining';

import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';

import { getErrorToastOptions, getSuccessToastOptions, UI_COLORS } from 'constants/ui';
import { useBOMContractContext } from 'pages/AMMTrading/contexts/BOMContractContext';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { formatGasLimit, getIsOVM, getIsPolygon, getL1FeeInWei } from 'utils/network';
import { getIsAppReady } from 'redux/modules/app';
import { AccountMarketInfo } from 'types/options';
import { BINARY_OPTIONS_EVENTS } from 'constants/events';
import { refetchMarketQueries, refetchUserBalance } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { L2_EXERCISE_GAS_LIMIT } from 'constants/options';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
// import { dispatchMarketNotification } from 'utils/options';
import { formatCurrency } from 'utils/formatters/number';
import { toast } from 'react-toastify';
import { getStableCoinForNetwork } from '../../../../utils/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from '../../../../constants/network';

const Maturity: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const optionsMarket = useMarketContext();
    const BOMContract = useBOMContractContext();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [isExercising, setIsExercising] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);

    let accountMarketInfo = {
        long: 0,
        short: 0,
    };

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        accountMarketInfo = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    const { result } = optionsMarket;
    const longAmount = accountMarketInfo.long;
    const shortAmount = accountMarketInfo.short;
    const isLongResult = result === 'long';
    const nothingToExercise = (isLongResult && !longAmount) || (!isLongResult && !shortAmount);
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
        const fetchL1Fee = async (BOMContractWithSigner: any) => {
            const txRequest = await BOMContractWithSigner.populateTransaction.exerciseOptions();
            return getL1FeeInWei(txRequest, snxJSConnector);
        };
        const fetchGasLimit = async () => {
            try {
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);

                if (isL2) {
                    // const [gasEstimate, l1FeeInWei] = await Promise.all([
                    //     BOMContractWithSigner.estimateGas.exerciseOptions(),
                    //     fetchL1Fee(BOMContractWithSigner),
                    // ]);
                    const l1FeeInWei = await fetchL1Fee(BOMContractWithSigner);
                    setGasLimit(L2_EXERCISE_GAS_LIMIT);
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await BOMContractWithSigner.estimateGas.exerciseOptions();
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || nothingToExercise) return;
        fetchGasLimit();
    }, [isWalletConnected, nothingToExercise]);

    const handleExercise = async () => {
        const id = toast.loading(t('options.market.trade-card.maturity.confirm-button.progress-label'));

        try {
            setIsExercising(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);

            const gasPrice = await snxJSConnector.provider?.getGasPrice();
            const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

            const providerOptions = isPolygon
                ? {
                      gasLimit,
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit,
                  };

            const tx = (await BOMContractWithSigner.exerciseOptions(providerOptions)) as ethers.ContractTransaction;

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
                        blockNumber: tx.blockNumber || 0,
                    },
                })
            );

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(t('options.market.trade-card.maturity.confirm-button.confirmation-message'))
                );
                // dispatchMarketNotification(t('options.market.trade-card.maturity.confirm-button.confirmation-message'));
                dispatch(
                    updateOptionsPendingTransactionStatus({
                        hash: txResult.transactionHash,
                        status: 'confirmed',
                        blockNumber: txResult.blockNumber,
                    })
                );
                refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                refetchUserBalance(walletAddress, networkId);
                setIsExercising(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsExercising(false);
        }
    };

    return (
        <Container>
            <Header>{t('options.market.trade-card.maturity.card-title')}</Header>
            <Label>
                {nothingToExercise
                    ? t('options.market.trade-card.maturity.nothing-to-exercise')
                    : t('options.market.trade-card.maturity.exercise-options')}
            </Label>
            <OptionsContainer>
                <Input
                    container={{ height: '60px', margin: '0 10px 0 0' }}
                    value={longAmount}
                    disabled={!isLongResult || !longAmount}
                    borderColor={UI_COLORS.GREEN}
                    valueEditDisable={true}
                    subValue={<Icon className="v2-icon v2-icon--up" color={UI_COLORS.GREEN} />}
                />
                <Input
                    container={{ height: '60px' }}
                    value={shortAmount}
                    disabled={isLongResult || !shortAmount}
                    borderColor={UI_COLORS.RED}
                    valueEditDisable={true}
                    subValue={<Icon className="v2-icon v2-icon--down" color={UI_COLORS.RED} />}
                />
            </OptionsContainer>
            <Input
                title={t('options.market.trade-card.maturity.payout-amount-label')}
                value={formatCurrency(isLongResult ? longAmount : shortAmount)}
                valueEditDisable={true}
                subValue={getStableCoinForNetwork(networkId)}
            />
            <Input
                title={'Time left to exercise'}
                valueAsComponent={true}
                value={
                    <TimeRemaining
                        end={optionsMarket.timeRemaining}
                        fontSize={20}
                        onEnded={() => refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address)}
                    />
                }
                valueEditDisable={true}
                container={{ margin: '0px 0px 20px 0px' }}
            />
            <Divider />
            <NetworkFees gasLimit={gasLimit} l1Fee={l1Fee} />
            <Button
                padding={'5px 20px'}
                active={true}
                hoverShadow={'var(--button-shadow)'}
                onClickHandler={handleExercise}
                margin={'150px auto 50px auto'}
                fontSize={'20px'}
                disabled={isButtonDisabled}
            >
                {nothingToExercise
                    ? t('options.market.trade-card.maturity.confirm-button.success-label')
                    : !isExercising
                    ? t('options.market.trade-card.maturity.confirm-button.label')
                    : t('options.market.trade-card.maturity.confirm-button.progress-label')}
            </Button>
        </Container>
    );
};

export default Maturity;
