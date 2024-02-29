import Modal from 'components/Modal';
import Swap from 'components/Swap';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { SWAP_SUPPORTED_NETWORKS } from 'constants/network';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import {
    getIsWalletConnected,
    getNetworkId,
    getSelectedCollateralIndex,
    getWalletAddress,
    setSelectedCollateralIndex,
} from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { Coins, formatCurrencyWithKey } from 'thales-utils';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import {
    getAssetIcon,
    getCoinBalance,
    getCollateral,
    getCollateralIndexForNetwork,
    getDefaultCollateral,
    getCollateralIndexByBalance,
} from 'utils/currency';
import { getIsMultiCollateralSupported } from 'utils/network';

type SwapCollateral = {
    type: Coins;
    balance: number;
};

const UserSwap: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const userSelectedCollateralIndex = useSelector((state: RootState) => getSelectedCollateralIndex(state));

    const [showSwap, setShowSwap] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [swapToStableCoin, setSwapToStableCoin] = useState(SYNTHS_MAP.sUSD as Coins);

    const multipleCollateralBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && isMultiCollateralSupported,
    });

    const multipleCollateralBalancesData =
        multipleCollateralBalances.isSuccess && multipleCollateralBalances.data
            ? multipleCollateralBalances.data
            : null;

    const sUSDBalance = getCoinBalance(multipleCollateralBalancesData, SYNTHS_MAP.sUSD as Coins);
    const DAIBalance = getCoinBalance(multipleCollateralBalancesData, CRYPTO_CURRENCY_MAP.DAI as Coins);
    const USDCBalance = getCoinBalance(multipleCollateralBalancesData, CRYPTO_CURRENCY_MAP.USDC as Coins);
    const USDTBalance = getCoinBalance(multipleCollateralBalancesData, CRYPTO_CURRENCY_MAP.USDT as Coins);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '' && !isMultiCollateralSupported,
    });

    const stableBalance = stableBalanceQuery?.isSuccess && stableBalanceQuery?.data ? stableBalanceQuery.data : null;
    const balance = getCurrencyKeyStableBalance(stableBalance, getDefaultCollateral(networkId)) || 0;

    const userCollaterals: SwapCollateral[] = useMemo(() => {
        const collaterals = [];
        if (isMultiCollateralSupported) {
            collaterals.push(
                { type: SYNTHS_MAP.sUSD as Coins, balance: sUSDBalance },
                { type: CRYPTO_CURRENCY_MAP.DAI as Coins, balance: DAIBalance },
                { type: CRYPTO_CURRENCY_MAP.USDC as Coins, balance: USDCBalance }, // default for Polygon
                { type: CRYPTO_CURRENCY_MAP.USDT as Coins, balance: USDTBalance }
            );
        } else {
            collaterals.push({ type: getDefaultCollateral(networkId), balance: balance });
        }

        return collaterals;
    }, [isMultiCollateralSupported, sUSDBalance, DAIBalance, USDCBalance, USDTBalance, balance, networkId]);

    const defaultCollateral = isMultiCollateralSupported
        ? userCollaterals.find(
              (el) =>
                  el.type ===
                  getCollateral(
                      networkId,
                      getCollateralIndexByBalance(
                          multipleCollateralBalances?.data,
                          networkId,
                          getCollateral(networkId, userSelectedCollateralIndex) as Coins
                      )
                  )
          ) || userCollaterals[0]
        : userCollaterals[0];

    const [collateral, setCollateral] = useState(defaultCollateral);
    const [swapText, setSwapText] = useState('');
    const [swapTextIndex, setSwapTextIndex] = useState(-1);

    useEffect(() => {
        if (isMultiCollateralSupported) {
            const collateralIndexWithPositiveBalance = getCollateralIndexByBalance(
                multipleCollateralBalances?.data,
                networkId,
                collateral.type
            );
            const positiveCollateral = userCollaterals.find(
                (el) => el.type === getCollateral(networkId, collateralIndexWithPositiveBalance)
            );

            if (positiveCollateral && positiveCollateral.type !== collateral.type) {
                setCollateral(positiveCollateral);
                dispatch(setSelectedCollateralIndex(getCollateralIndexForNetwork(networkId, positiveCollateral.type)));
            }
        }
    }, [
        multipleCollateralBalances.data,
        stableBalanceQuery.data,
        dispatch,
        isMultiCollateralSupported,
        networkId,
        userCollaterals,
        collateral.type,
    ]);

    useEffect(() => {
        if (!isMultiCollateralSupported) {
            dispatch(setSelectedCollateralIndex(0));
        }
    }, [dispatch, isMultiCollateralSupported, networkId]);

    useEffect(() => {
        const selectedCollateral =
            userCollaterals.find((el) => el.type === getCollateral(networkId, userSelectedCollateralIndex)) ||
            userCollaterals[0];
        setCollateral(selectedCollateral);
    }, [userSelectedCollateralIndex, networkId, userCollaterals]);

    const onStableHoverHandler = (index: number, stableCoin: Coins) => {
        if (isWalletConnected && SWAP_SUPPORTED_NETWORKS.includes(networkId)) {
            setSwapTextIndex(index);
            setSwapText(
                t('common.swap.button-text', {
                    token: stableCoin,
                })
            );
        }
    };

    const onStableClickHandler = (coinType: Coins) => {
        if (!showSwap && SWAP_SUPPORTED_NETWORKS.includes(networkId)) {
            setSwapToStableCoin(coinType);
            isWalletConnected && setShowSwap(true);
        }
        dispatch(setSelectedCollateralIndex(getCollateralIndexForNetwork(networkId, coinType)));
    };

    const closeSwap = (isShowSwap: boolean) => {
        if (!isShowSwap) {
            setSwapText(formatCurrencyWithKey(collateral.type, collateral.balance, 2));
            setIsDropdownOpen(false);
            setShowSwap(isShowSwap);
        }
    };

    const assetIcon = (type: string) => {
        const AssetIconElement = getAssetIcon(type as Coins);
        return <AssetIconElement style={AssetIconStyle} />;
    };

    return (
        <Container>
            <OutsideClickHandler onOutsideClick={() => isDropdownOpen && setIsDropdownOpen(false)}>
                <Wrapper>
                    <SwapWrapper
                        clickable={
                            isWalletConnected &&
                            !showSwap &&
                            (SWAP_SUPPORTED_NETWORKS.includes(networkId) || isMultiCollateralSupported)
                        }
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
                                                : formatCurrencyWithKey(coin.type as Coins, coin.balance, 2)}
                                        </BalanceText>
                                    </BalanceTextWrapper>
                                </BalanceWrapper>
                            ))}
                        </Dropdown>
                    )}
                </Wrapper>
                {showSwap && (
                    <Suspense fallback={<></>}>
                        <Modal
                            title={t('common.swap.title', { token: swapToStableCoin })}
                            onClose={() => setShowSwap(false)}
                            shouldCloseOnOverlayClick={false}
                            customStyle={{ overlay: { zIndex: 2000 } }}
                        >
                            <Swap handleClose={closeSwap} initialToToken={swapToStableCoin}></Swap>
                        </Modal>
                    </Suspense>
                )}
            </OutsideClickHandler>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;

const Wrapper = styled(FlexDivRow)`
    position: relative;
    display: flex;
    width: 150px;
    @media (max-width: 500px) {
        min-width: 124px;
        width: 100%;
    }
`;

const SwapWrapper = styled.div<{ clickable: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
    padding: 4px 13px;
    @media (max-width: 500px) {
        padding: 4px 7px;
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
    @media (max-width: 500px) {
        min-width: 124px;
        width: 100%;
    }
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
