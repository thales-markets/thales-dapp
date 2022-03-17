import { Modal } from '@material-ui/core';
import Swap from 'components/Swap';
import { SYNTHS_MAP } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey } from 'utils/formatters/number';

export const UserSwap: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [showSwap, setShowSwap] = useState(false);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress ?? '', networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const [buttonText, setButtonText] = useState(sUSDBalance);

    useEffect(() => {
        setButtonText(formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance, 4));
    }, [sUSDBalance]);

    return (
        <>
            <SwapButton
                onMouseOver={() => setButtonText(t('options.swap.button-text'))}
                onMouseOut={() => setButtonText(formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance, 4))}
                onClick={() => setShowSwap(true)}
            >
                <SwapButtonIcon className="v2-icon v2-icon--dollar" />
                <SwapButtonText>{buttonText}</SwapButtonText>
            </SwapButton>
            <Modal
                open={showSwap}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') setShowSwap(false);
                }}
                style={{ backdropFilter: 'blur(10px)' }}
            >
                <Swap handleClose={setShowSwap}></Swap>
            </Modal>
        </>
    );
};

const SwapButton = styled.div`
    display: block;
    position: absolute;
    background-color: var(--input-border-color);
    font-family: Sansation !important;
    color: var(--background);
    border-radius: 20px;
    cursor: pointer;
    width: 130px;
    padding: 5px;
    right: 234px;
    top: 0;
    @media (max-width: 1024px) {
        right: 224px;
        top: 22px;
    }
`;

const SwapButtonIcon = styled.i`
    color: var(--background);
    font-size: 20px;
    padding-right: 5px;
    display: inline;
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

export default UserSwap;
