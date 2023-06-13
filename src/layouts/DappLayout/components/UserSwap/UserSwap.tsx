import Modal from 'components/Modal';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { COLLATERALS } from 'constants/options';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
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
import { FlexDivRow } from 'styles/common';
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

const UserSwap: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));
    const dispatch = useDispatch();

    const [showSwap, setShowSwap] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [swapToStableCoin, setSwapToStableCoin] = useState(SYNTHS_MAP.sUSD as StableCoins);

    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && isMultiCollateralSupported,
    });

    const multipleStableBalancesData =
        multipleStableBalances.isSuccess && multipleStableBalances.data ? multipleStableBalances.data : null;

    const sUSDBalance = getStableCoinBalance(multipleStableBalancesData, SYNTHS_MAP.sUSD as StableCoins);
    const DAIBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.DAI as StableCoins);
    const USDCBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.USDC as StableCoins);
    const USDTBalance = getStableCoinBalance(multipleStableBalancesData, CRYPTO_CURRENCY_MAP.USDT as StableCoins);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && !isMultiCollateralSupported,
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
    const [swapText, setSwapText] = useState('');
    const [swapTextIndex, setSwapTextIndex] = useState(-1);

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

    const onStableHoverHandler = (index: number, stableCoin: StableCoins) => {
        if (isWalletConnected) {
            setSwapTextIndex(index);
            setSwapText(
                t('options.swap.button-text', {
                    token: stableCoin,
                })
            );
        }
    };

    const onStableClickHandler = (coinType: StableCoins) => {
        if (!showSwap) {
            setSwapToStableCoin(coinType);
            isWalletConnected && setShowSwap(true);
            dispatch(setSelectedCollateral(COLLATERALS.findIndex((el) => el === coinType)));
        }
    };

    const closeSwap = (isShowSwap: boolean) => {
        if (!isShowSwap) {
            setSwapText(formatCurrencyWithKey(collateral.type, collateral.balance, 2));
            setIsDropdownOpen(false);
            setShowSwap(isShowSwap);
        }
    };

    const assetIcon = (type: string) => {
        const AssetIcon = getAssetIcon(getStableCoinForNetwork(networkId, type as StableCoins));
        return <AssetIcon style={AssetIconStyle} />;
    };

    return (
        <OutsideClickHandler onOutsideClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
            <Container>
                <SwapWrapper
                    clickable={isWalletConnected && !showSwap}
                    onClick={() =>
                        isWalletConnected &&
                        (isMultiCollateralSupported
                            ? setIsDropdownOpen(!isDropdownOpen)
                            : onStableClickHandler(collateral.type))
                    }
                    onMouseOver={() => !isMultiCollateralSupported && onStableHoverHandler(0, collateral.type)}
                    onMouseLeave={() => setSwapText('')}
                >
                    {assetIcon(collateral.type)}
                    <BalanceTextWrapper>
                        <BalanceText>
                            {!isMultiCollateralSupported && swapText && swapTextIndex === 0
                                ? swapText
                                : formatCurrencyWithKey(collateral.type, collateral.balance, 2)}
                        </BalanceText>
                    </BalanceTextWrapper>
                    {isWalletConnected && isMultiCollateralSupported && (
                        <Icon className={isDropdownOpen ? `icon icon--caret-up` : `icon icon--caret-down`} />
                    )}
                </SwapWrapper>
                {isDropdownOpen && (
                    <Dropdown>
                        {userCollaterals.map((coin, index) => (
                            <BalanceWrapper
                                key={index}
                                clickable={isWalletConnected && !showSwap}
                                onClick={() => onStableClickHandler(coin.type)}
                                onMouseOver={() => onStableHoverHandler(index, coin.type)}
                                onMouseLeave={() => setSwapText('')}
                            >
                                {assetIcon(coin.type)}
                                <BalanceTextWrapper>
                                    <BalanceText>
                                        {swapText && swapTextIndex === index
                                            ? swapText
                                            : formatCurrencyWithKey(
                                                  getStableCoinForNetwork(networkId, coin.type as StableCoins),
                                                  coin.balance,
                                                  2
                                              )}
                                    </BalanceText>
                                </BalanceTextWrapper>
                            </BalanceWrapper>
                        ))}
                    </Dropdown>
                )}
            </Container>
            {showSwap && (
                <Suspense fallback={<></>}>
                    <Modal
                        title={t('options.swap.title')}
                        onClose={() => setShowSwap(false)}
                        shouldCloseOnOverlayClick={false}
                        customStyle={{ overlay: { zIndex: 201 } }}
                    >
                        <Swap handleClose={closeSwap} initialToToken={swapToStableCoin}></Swap>
                    </Modal>
                </Suspense>
            )}
        </OutsideClickHandler>
    );
};

const Container = styled(FlexDivRow)`
    position: relative;
    display: flex;
    width: 150px;
`;

const SwapWrapper = styled.div<{ clickable: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
    padding: 4px 13px;
    @media (max-width: 500px) {
        padding: 4px 10px;
    }
`;

const Dropdown = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 30px;
    right: 0;
    background-color: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    width: 150px;
    padding: 5px;
    text-align: center;
    z-index: 101;
    gap: 5px;
`;

const BalanceWrapper = styled.div<{ clickable: boolean }>`
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    padding: 6px;
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
    border-radius: 8px;
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
`;

const BalanceTextWrapper = styled.div`
    text-align: center;
    margin: auto;
`;

const BalanceText = styled.span`
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
`;

const AssetIconStyle = { width: '16px', height: '16px', marginRight: '5px' };

const Icon = styled.i`
    margin-left: auto;
    font-size: 10px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default UserSwap;
