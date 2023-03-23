import { Modal } from '@material-ui/core';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { COLLATERALS } from 'constants/options';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import {
    getIsWalletConnected,
    getNetworkId,
    getSelectedCollateral,
    getWalletAddress,
    setSelectedCollateral,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { StableCoins } from 'types/options';
import { getCurrencyKeyStableBalance } from 'utils/balances';

import {
    getAssetIcon,
    getDefaultStableIndexByBalance,
    getStableCoinBalance,
    getStableCoinForNetwork,
} from 'utils/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { getIsMultiCollateralSupported } from 'utils/network';

const Swap = lazy(() => import(/* webpackChunkName: "Swap" */ 'components/Swap'));

type SwapCollateral = {
    type: StableCoins;
    balance: number;
};

export const UserSwap: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));
    const dispatch = useDispatch();

    const [showSwap, setShowSwap] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [swapToStableCoin, setSwapToStableCoin] = useState(SYNTHS_MAP.sUSD as StableCoins);

    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && isMultiCollateralSupported,
        refetchInterval: 5000,
    });

    const multipleStableBalancesData =
        multipleStableBalances.isSuccess && multipleStableBalances.data ? multipleStableBalances.data : null;

    const sUSDBalance = getStableCoinBalance(multipleStableBalancesData, SYNTHS_MAP.sUSD as StableCoins);
    const DAIBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.DAI as StableCoins);
    const USDCBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.USDC as StableCoins);
    const USDTBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.USDT as StableCoins);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && !isMultiCollateralSupported,
        refetchInterval: 5000,
    });

    const stableBalance = stableBalanceQuery?.isSuccess && stableBalanceQuery?.data ? stableBalanceQuery.data : null;
    const balance = getCurrencyKeyStableBalance(stableBalance, getStableCoinForNetwork(networkId)) || 0;

    const userCollaterals: SwapCollateral[] = [];
    if (isMultiCollateralSupported) {
        userCollaterals.push(
            { type: SYNTHS_MAP.sUSD as StableCoins, balance: sUSDBalance },
            { type: CRYPTO_CURRENCY_MAP.DAI as StableCoins, balance: DAIBalance },
            { type: CRYPTO_CURRENCY_MAP.USDC as StableCoins, balance: USDCBalance }, // default for Polygon
            { type: CRYPTO_CURRENCY_MAP.USDT as StableCoins, balance: USDTBalance }
        );
    } else {
        userCollaterals.push({ type: getStableCoinForNetwork(networkId) as StableCoins, balance: balance });
    }

    const defaultCollateral = isMultiCollateralSupported
        ? userCollaterals.find(
              (el) => el.type === COLLATERALS[getDefaultStableIndexByBalance(multipleStableBalances?.data)]
          ) || userCollaterals[0]
        : userCollaterals[0];

    const [collateral, setCollateral] = useState(defaultCollateral);
    const [buttonText, setButtonText] = useState(collateral.balance.toString());

    useEffect(() => {
        const positiveCollateral = isMultiCollateralSupported
            ? userCollaterals.find(
                  (el) => el.type === COLLATERALS[getDefaultStableIndexByBalance(multipleStableBalances?.data)]
              ) || userCollaterals[0]
            : userCollaterals[0];
        setCollateral(positiveCollateral);
        dispatch(setSelectedCollateral(COLLATERALS.findIndex((el) => el === positiveCollateral.type)));
    }, [multipleStableBalances.data, stableBalanceQuery.data]);

    useEffect(() => {
        const selectedCollateral =
            userCollaterals.find((el) => el.type === COLLATERALS[userSelectedCollateral]) || userCollaterals[0];
        setCollateral(selectedCollateral);
    }, [userSelectedCollateral]);

    useEffect(() => {
        setButtonText(formatCurrencyWithKey(collateral.type, collateral.balance, 2));
    }, [collateral.balance, collateral.type]);

    const mouseOverHandler = () => {
        if (isWalletConnected) {
            setButtonText(
                t('options.swap.button-text', {
                    token: isMultiCollateralSupported ? getStableCoinForNetwork(networkId) : 'Stablecoin',
                })
            );
            if (isMultiCollateralSupported) {
                setShowBalance(true);
            }
        }
    };

    const mouseLeaveHandler = () => {
        setButtonText(formatCurrencyWithKey(collateral.type, collateral.balance, 2));
        setShowBalance(false);
    };

    const mouseClickHandler = (coinType: StableCoins) => {
        if (!showSwap) {
            setSwapToStableCoin(coinType);
            isWalletConnected ? setShowSwap(true) : '';
            dispatch(setSelectedCollateral(COLLATERALS.findIndex((el) => el === coinType)));
        }
    };

    const closeSwap = (isShowSwap: boolean) => {
        if (!isShowSwap) {
            setButtonText(formatCurrencyWithKey(collateral.type, collateral.balance, 2));
            setShowBalance(false);
            setShowSwap(isShowSwap);
        }
    };

    const assetIcon = (type: string) => {
        const AssetIcon = getAssetIcon(getStableCoinForNetwork(networkId, type as StableCoins));
        return <AssetIcon style={AssetIconStyle} />;
    };

    return (
        <>
            <SwapWrapper onMouseOver={mouseOverHandler} onMouseLeave={mouseLeaveHandler}>
                <SwapButton
                    clickable={isWalletConnected && !showSwap}
                    onClick={() => mouseClickHandler(collateral.type)}
                >
                    {assetIcon(collateral.type)}
                    <SwapButtonTextWrap>
                        <SwapButtonText>{buttonText}</SwapButtonText>
                    </SwapButtonTextWrap>
                </SwapButton>
                {showBalance && (
                    <BalanceContainer>
                        {userCollaterals.map((coin, index) => (
                            <BalanceWrapper
                                key={index}
                                clickable={isWalletConnected && !showSwap}
                                onClick={() => mouseClickHandler(coin.type)}
                            >
                                {assetIcon(coin.type)}
                                <BalanceTextWrap>
                                    <BalanceText>
                                        {formatCurrencyWithKey(
                                            getStableCoinForNetwork(networkId, coin.type as StableCoins),
                                            coin.balance,
                                            2
                                        )}
                                    </BalanceText>
                                </BalanceTextWrap>
                            </BalanceWrapper>
                        ))}
                    </BalanceContainer>
                )}
            </SwapWrapper>
            {showSwap && (
                <Modal
                    open={showSwap}
                    onClose={(_, reason) => {
                        if (reason !== 'backdropClick') setShowSwap(false);
                    }}
                    style={{ backdropFilter: 'blur(10px)' }}
                >
                    <Suspense fallback={<></>}>
                        <Swap handleClose={closeSwap} initialToToken={swapToStableCoin}></Swap>
                    </Suspense>
                </Modal>
            )}
        </>
    );
};

const SwapWrapper = styled.div`
    position: absolute;
    width: 130px;
    right: 365px;
    top: 40px;
    @media (max-width: 1024px) {
        right: 334px;
        top: 20px;
    }

    @media (max-width: 400px) {
        right: 194px;
        top: 20px;
    }
`;

const SwapButton = styled.div<{ clickable: boolean }>`
    display: -webkit-flex;
    background-color: var(--input-border-color);
    font-family: Sansation !important;
    color: var(--background);
    border-radius: 15px;
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
    white-space: pre;
    padding: 6px 7px;
    text-align: center;
`;

const SwapButtonTextWrap = styled.div`
    text-align: center;
    margin: auto;
`;

const SwapButtonText = styled.p`
    color: var(--background);
    font-style: normal;
    font-weight: normal;
    font-size: 12.5px;
    line-height: 14px;
    display: inline;
    text-align: center;
`;

const BalanceContainer = styled.div`
    position: relative;
    top: 6px;
    background-color: var(--input-border-color);
    border-radius: 15px;
    padding: 5px 0;
    text-align: center;
    z-index: 1;
`;

const BalanceWrapper = styled.div<{ clickable: boolean }>`
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    margin: 4px 7px;
    padding: 2px 0;
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
`;

const BalanceTextWrap = styled.div`
    text-align: center;
    margin: auto;
`;

const BalanceText = styled.span`
    font-size: 13px;
    color: var(--background);
`;

const AssetIconStyle = { width: '20px', height: '20px' };

export default UserSwap;
