import React, { useEffect, useState } from 'react';
import useThalesBalanceQuery from '../../queries/walletBalances/useThalesBalanceQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../redux/modules/wallet';
import { getIsAppReady } from '../../redux/modules/app';
import useStakingThalesQuery from '../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../queries/staking/useEscrowThalesQuery';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivSpaceBetween } from '../../theme/common';
import { formatCurrencyWithKey } from '../../utils/formatters/number';
import { THALES_CURRENCY } from '../../constants/currency';
import { useTranslation } from 'react-i18next';

type Properties = {
    setThalesTotalBalance: (balance: number) => void;
};

const ThalesBalanceTooltip: React.FC<Properties> = ({ setThalesTotalBalance }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [thalesStaked, setThalesStaked] = useState(0);
    const [escrowedBalance, setEscrowedBalance] = useState(0);
    const [thalesBalance, setThalesBalance] = useState(0);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { thalesStaked } = stakingThalesQuery.data;
            setThalesStaked(Number(thalesStaked));
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            setEscrowedBalance(escrowThalesQuery.data.escrowedBalance);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess, stakingThalesQuery.data, escrowThalesQuery.data]);

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    useEffect(() => {
        setThalesTotalBalance(
            Number(thalesBalance.toFixed(2)) + Number(escrowedBalance.toFixed(2)) + Number(thalesStaked.toFixed(2))
        );
    }, [thalesBalance, escrowedBalance, thalesStaked]);

    return (
        <>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t(`user-info.wallet.in-wallet`)}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}</BalanceValue>
            </FlexDivSpaceBetween>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t(`user-info.wallet.total-staked`)}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}</BalanceValue>
            </FlexDivSpaceBetween>
            <FlexDivSpaceBetween>
                <BalanceTitle>{t(`user-info.wallet.total-escrowed`)}:</BalanceTitle>
                <BalanceValue>{formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}</BalanceValue>
            </FlexDivSpaceBetween>
        </>
    );
};

const BalanceTitle = styled(FlexDivCentered)`
    font-size: 13px;
    line-height: 14px;
    letter-spacing: 0.4px;
    padding: 5px 10px 5px 0;
`;

const BalanceValue = styled(FlexDivCentered)`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
`;

export default ThalesBalanceTooltip;
