import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TimeRemaining from 'components/TimeRemaining';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { Positions } from 'enums/options';
import { ethers } from 'ethers';
import { useBOMContractContext } from 'pages/AMMTrading/contexts/BOMContractContext';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import SharePositionModal from 'pages/Trade/components/AmmTrading/components/SharePositionModal';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import useClaimablePositionsQuery from 'queries/profile/useClaimablePositionsQuery';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTheme } from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithPrecision } from 'thales-utils';
import { AccountMarketInfo, RangedMarketBalanceInfo, RangedMarketPositionType } from 'types/options';
import { UserPosition } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { getDefaultCollateral } from 'utils/currency';
import {
    refetchBalances,
    refetchMarketQueries,
    refetchRangeMarketQueries,
    refetchUserNotifications,
} from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import {
    additionalButtonStyle,
    Container,
    Header,
    Info,
    InfoContainer,
    InfoItem,
    InfoLabel,
    Label,
    LoaderContainer,
    Position,
    PositionsContainer,
    ShareIcon,
} from './styled-components';

type MaturityProps = {
    isRangedMarket: boolean;
    isDeprecatedCurrency: boolean;
};

const Maturity: React.FC<MaturityProps> = ({ isRangedMarket, isDeprecatedCurrency }) => {
    const rangedMarket = useRangedMarketContext();
    const directMarket = useMarketContext();
    const market = isRangedMarket ? rangedMarket : directMarket;
    const BOMContract = useBOMContractContext();
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isAppReady = useSelector(getIsAppReady);
    const isWalletConnected = useSelector(getIsWalletConnected);
    const walletAddress = useSelector(getWalletAddress) || '';
    const networkId = useSelector(getNetworkId);

    const [isExercising, setIsExercising] = useState<boolean>(false);
    const [openTwitterShareModal, setOpenTwitterShareModal] = useState<boolean>(false);

    let optBalances = isRangedMarket ? { in: 0, out: 0 } : { short: 0, long: 0 };

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(
        market.address,
        walletAddress,
        networkId,
        isDeprecatedCurrency,
        {
            enabled: isAppReady && isWalletConnected && !isRangedMarket,
        }
    );

    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(market.address, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isRangedMarket,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data && !isRangedMarket) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    if (isWalletConnected && rangedMarketsBalance.isSuccess && rangedMarketsBalance.data && isRangedMarket) {
        optBalances = rangedMarketsBalance.data as RangedMarketBalanceInfo;
    }

    const claimablePositionsQuery = useClaimablePositionsQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const claimablePosition: UserPosition | undefined =
        claimablePositionsQuery.isSuccess && claimablePositionsQuery.data
            ? claimablePositionsQuery.data.find((position) => position.market == market.address)
            : undefined;

    const { result } = market;
    const upAmount = optBalances.long || 0;
    const downAmount = optBalances.short || 0;
    const inAmount = optBalances.in || 0;
    const outAmount = optBalances.out || 0;

    const isUpResult = result === 'long';
    const isInResult = (result as RangedMarketPositionType) === 'in';

    const position = result == 'long' ? 'UP' : result == 'short' ? 'DOWN' : result.toUpperCase();

    const nothingToExercise = isRangedMarket
        ? (isInResult && !inAmount) || (!isInResult && !outAmount)
        : (isUpResult && !upAmount) || (!isUpResult && !downAmount);
    const isButtonDisabled = isExercising || !isWalletConnected || nothingToExercise;

    const handleExercise = async () => {
        const id = toast.loading(
            getDefaultToastContent(t('markets.market.trade-card.maturity.confirm-button.progress-label')),
            getLoadingToastOptions()
        );

        try {
            setIsExercising(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);

            const tx = (isRangedMarket
                ? await BOMContractWithSigner.exercisePositions()
                : await BOMContractWithSigner.exerciseOptions()) as ethers.ContractTransaction;

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t('markets.market.trade-card.maturity.confirm-button.confirmation-message'),
                        id
                    )
                );
                isRangedMarket
                    ? refetchRangeMarketQueries(
                          walletAddress,
                          BOMContract.address,
                          market.address,
                          networkId,
                          isDeprecatedCurrency
                      )
                    : refetchMarketQueries(walletAddress, BOMContract.address, market.address, isDeprecatedCurrency);
                refetchBalances(walletAddress, networkId, isDeprecatedCurrency);
                refetchUserNotifications(walletAddress, networkId);
                setIsExercising(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsExercising(false);
        }
    };

    return (
        <>
            <Header>{t('markets.market.trade-card.maturity.card-title')}</Header>
            {accountMarketInfoQuery.isLoading || rangedMarketsBalance.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                <Container>
                    <Label>
                        {nothingToExercise
                            ? t('markets.market.trade-card.maturity.nothing-to-exercise')
                            : t('markets.market.trade-card.maturity.exercise-options')}
                    </Label>
                    <PositionsContainer>
                        <Position
                            isDisabled={isRangedMarket ? !isInResult || !inAmount : !isUpResult || !upAmount}
                            color={isRangedMarket ? theme.positionColor.in : theme.positionColor.up}
                        >
                            <span>{formatCurrencyWithPrecision(isRangedMarket ? inAmount : upAmount)}</span>
                            <span>{isRangedMarket ? Positions.IN : Positions.UP}</span>
                        </Position>
                        <Position
                            isDisabled={isRangedMarket ? isUpResult || !outAmount : isUpResult || !downAmount}
                            color={isRangedMarket ? theme.positionColor.out : theme.positionColor.down}
                        >
                            <span>{formatCurrencyWithPrecision(isRangedMarket ? outAmount : downAmount)}</span>
                            <span>{isRangedMarket ? Positions.OUT : Positions.DOWN}</span>
                        </Position>
                    </PositionsContainer>
                    <InfoContainer>
                        <InfoItem>
                            <InfoLabel>{t('markets.market.trade-card.maturity.payout-amount-label')}</InfoLabel>
                            <Info>
                                {formatCurrencyWithKey(
                                    getDefaultCollateral(networkId, isDeprecatedCurrency),
                                    isRangedMarket
                                        ? isInResult
                                            ? inAmount
                                            : outAmount
                                        : isUpResult
                                        ? upAmount
                                        : downAmount
                                )}
                            </Info>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>{t('markets.market.trade-card.maturity.end-label')}</InfoLabel>
                            <TimeRemaining
                                end={market.timeRemaining}
                                fontSize={13}
                                onEnded={() =>
                                    isRangedMarket
                                        ? refetchRangeMarketQueries(
                                              walletAddress,
                                              BOMContract.address,
                                              market.address,
                                              networkId,
                                              isDeprecatedCurrency
                                          )
                                        : refetchMarketQueries(
                                              walletAddress,
                                              BOMContract.address,
                                              market.address,
                                              isDeprecatedCurrency
                                          )
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
                            ? t('markets.market.trade-card.maturity.confirm-button.success-label')
                            : !isExercising
                            ? t('markets.market.trade-card.maturity.confirm-button.label')
                            : t('markets.market.trade-card.maturity.confirm-button.progress-label')}
                    </Button>
                    <ShareIcon
                        className="icon-home icon-home--twitter-x"
                        disabled={false}
                        onClick={() => {
                            setOpenTwitterShareModal(true);
                        }}
                    />
                    {openTwitterShareModal && claimablePosition && (
                        <SharePositionModal
                            type={'resolved'}
                            position={position as Positions}
                            currencyKey={claimablePosition.currencyKey}
                            strikeDate={claimablePosition.maturityDate}
                            strikePrice={claimablePosition.strikePrice}
                            leftPrice={claimablePosition.leftPrice}
                            rightPrice={claimablePosition.rightPrice}
                            buyIn={claimablePosition.paid}
                            payout={
                                isRangedMarket
                                    ? isInResult
                                        ? inAmount
                                        : outAmount
                                    : isUpResult
                                    ? upAmount
                                    : downAmount
                            }
                            onClose={() => setOpenTwitterShareModal(false)}
                        />
                    )}
                </Container>
            )}
        </>
    );
};

export default Maturity;
