import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import {
    Container,
    Header,
    Label,
    PositionsContainer,
    Position,
    InfoContainer,
    InfoItem,
    additionalButtonStyle,
    InfoLabel,
    Info,
} from './styled-components';
import Button from 'components/ButtonV2';
import TimeRemaining from 'components/TimeRemaining';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { useBOMContractContext } from 'pages/AMMTrading/contexts/BOMContractContext';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { AccountMarketInfo, RangedMarketBalanceInfo, RangedMarketPositionType } from 'types/options';
import { refetchMarketQueries, refetchBalances, refetchRangeMarketQueries } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { Positions, getMaxGasLimitForNetwork } from 'constants/options';
import { formatCurrencyWithPrecision, formatCurrencyWithKey } from 'utils/formatters/number';
import { toast } from 'react-toastify';
import { getStableCoinForNetwork } from '../../../../utils/currency';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';

const Maturity: React.FC<{ isRangedAmm: boolean }> = ({ isRangedAmm }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const optionsMarket = isRangedAmm ? useRangedMarketContext() : useMarketContext();
    const BOMContract = useBOMContractContext();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [isExercising, setIsExercising] = useState<boolean>(false);

    let optBalances = isRangedAmm ? { in: 0, out: 0 } : { short: 0, long: 0 };

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !isRangedAmm,
    });

    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(optionsMarket.address, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isRangedAmm,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data && !isRangedAmm) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    if (isWalletConnected && rangedMarketsBalance.isSuccess && rangedMarketsBalance.data && isRangedAmm) {
        optBalances = rangedMarketsBalance.data as RangedMarketBalanceInfo;
    }

    const { result } = optionsMarket;
    const upAmount = optBalances.long || 0;
    const downAmount = optBalances.short || 0;
    const inAmount = optBalances.in || 0;
    const outAmount = optBalances.out || 0;

    const isUpResult = result === 'long';
    const isInResult = (result as RangedMarketPositionType) === 'in';

    const nothingToExercise = isRangedAmm
        ? (isInResult && !inAmount) || (!isInResult && !outAmount)
        : (isUpResult && !upAmount) || (!isUpResult && !downAmount);
    const isButtonDisabled = isExercising || !isWalletConnected || nothingToExercise;

    const handleExercise = async () => {
        const id = toast.loading(t('options.market.trade-card.maturity.confirm-button.progress-label'));

        try {
            setIsExercising(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);

            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

            const tx = (isRangedAmm
                ? await BOMContractWithSigner.exercisePositions(providerOptions)
                : await BOMContractWithSigner.exerciseOptions(providerOptions)) as ethers.ContractTransaction;

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(t('options.market.trade-card.maturity.confirm-button.confirmation-message'))
                );
                isRangedAmm
                    ? refetchRangeMarketQueries(walletAddress, BOMContract.address, optionsMarket.address, networkId)
                    : refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
                refetchBalances(walletAddress, networkId);
                setIsExercising(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsExercising(false);
        }
    };

    return (
        <>
            <Header>{t('options.market.trade-card.maturity.card-title')}</Header>
            <Container>
                <Label>
                    {nothingToExercise
                        ? t('options.market.trade-card.maturity.nothing-to-exercise')
                        : t('options.market.trade-card.maturity.exercise-options')}
                </Label>
                <PositionsContainer>
                    <Position
                        isDisabled={isRangedAmm ? !isInResult || !inAmount : !isUpResult || !upAmount}
                        color={isRangedAmm ? theme.positionColor.in : theme.positionColor.up}
                    >
                        <span>{formatCurrencyWithPrecision(isRangedAmm ? inAmount : upAmount)}</span>
                        <span>{isRangedAmm ? Positions.IN : Positions.UP}</span>
                    </Position>
                    <Position
                        isDisabled={isRangedAmm ? isUpResult || !outAmount : isUpResult || !downAmount}
                        color={isRangedAmm ? theme.positionColor.out : theme.positionColor.down}
                    >
                        <span>{formatCurrencyWithPrecision(isRangedAmm ? outAmount : downAmount)}</span>
                        <span>{isRangedAmm ? Positions.OUT : Positions.DOWN}</span>
                    </Position>
                </PositionsContainer>
                <InfoContainer>
                    <InfoItem>
                        <InfoLabel>{t('options.market.trade-card.maturity.payout-amount-label')}</InfoLabel>
                        <Info>
                            {formatCurrencyWithKey(
                                getStableCoinForNetwork(networkId),
                                isRangedAmm ? (isInResult ? inAmount : outAmount) : isUpResult ? upAmount : downAmount
                            )}
                        </Info>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>{t('options.market.trade-card.maturity.end-label')}</InfoLabel>
                        <TimeRemaining
                            end={optionsMarket.timeRemaining}
                            fontSize={13}
                            onEnded={() =>
                                isRangedAmm
                                    ? refetchRangeMarketQueries(
                                          walletAddress,
                                          BOMContract.address,
                                          optionsMarket.address,
                                          networkId
                                      )
                                    : refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address)
                            }
                        />
                    </InfoItem>
                </InfoContainer>
                <Button
                    onClick={handleExercise}
                    margin={'30px auto 10px auto'}
                    disabled={isButtonDisabled}
                    backgroundColor={theme.button.textColor.quaternary}
                    additionalStyles={additionalButtonStyle}
                >
                    {nothingToExercise
                        ? t('options.market.trade-card.maturity.confirm-button.success-label')
                        : !isExercising
                        ? t('options.market.trade-card.maturity.confirm-button.label')
                        : t('options.market.trade-card.maturity.confirm-button.progress-label')}
                </Button>
            </Container>
        </>
    );
};

export default Maturity;
