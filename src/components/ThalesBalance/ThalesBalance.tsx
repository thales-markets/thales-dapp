import useEscrowThalesQuery from 'queries/staking/useEscrowThalesQuery';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getIsOVM } from 'utils/network';
import useOpThalesBalanceQuery from '../../queries/walletBalances/useOpThalesBalanceQuery';

type ThalesBalanceProps = {
    showTitle?: boolean;
};

const ThalesBalance: React.FC<ThalesBalanceProps> = ({ showTitle = true }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
        refetchInterval: 60 * 1000,
    });

    const opThalesBalanceQuery = useOpThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isL2,
    });

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
        refetchInterval: 60 * 1000,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
        refetchInterval: 60 * 1000,
    });

    const inWallet = isL2
        ? thalesBalanceQuery.isSuccess
            ? thalesBalanceQuery.data.balance
            : 0
        : opThalesBalanceQuery.isSuccess
        ? Number(opThalesBalanceQuery.data.balance)
        : 0;
    const staked = stakingThalesQuery.isSuccess ? stakingThalesQuery.data.thalesStaked : 0;
    const escrowedBalance = escrowThalesQuery.isSuccess ? escrowThalesQuery.data.escrowedBalance : 0;

    const proportions = useMemo(() => {
        return calculateWidth(inWallet, staked, escrowedBalance);
    }, [inWallet, staked, escrowedBalance]);

    return (
        <Wrapper>
            {showTitle && <Title>{t('user-info.wallet.my-thales')}:</Title>}
            <Bar background="#464DCF" width={proportions.inWallet}>
                <Label>{t('user-info.wallet.in-wallet')}</Label>
                <Amount>{formatCurrencyWithSign('', inWallet.toFixed(2))}</Amount>
            </Bar>
            <Bar background="#801BF2" width={proportions.staked}>
                <Label>{t('user-info.wallet.total-staked')}</Label>
                <Amount>{formatCurrencyWithSign('', staked.toFixed(2))}</Amount>
            </Bar>
            <Bar background="#1BAB9C" width={proportions.escrowed}>
                <Label>{t('user-info.wallet.total-escrowed')}</Label>
                <Amount>{formatCurrencyWithSign('', escrowedBalance.toFixed(2))}</Amount>
            </Bar>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const Title = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: #64d9fe;
    margin-bottom: 10px;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Bar = styled.div<{ width: number; background: string }>`
    display: flex;
    min-width: 50%;
    width: 50%;
    width: ${(props) => props.width + '%'};
    justify-content: space-between;
    align-items: center;
    border-radius: 11px;
    margin-bottom: 4px;
    background: ${(props) => props.background};
    padding: 0 10px;
    @media (max-width: 500px) {
        min-width: 70%;
    }
`;

const Label = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
    font-size: 12px;
    @media (max-width: 1024px) {
        font-size: 10px;
        line-height: 20px;
    }

    @media (max-width: 512px) {
        font-size: 8px;
        line-height: 16px;
    }
`;

const Amount = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    @media (max-width: 1024px) {
        font-size: 10px;
    }

    @media (max-width: 512px) {
        font-size: 8px;
    }
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
`;

const calculateWidth = (inWallet: number, staked: number, escrowedBalance: number) => {
    const result = { inWallet: 0, staked: 0, escrowed: 0 };
    if (inWallet === 0 && escrowedBalance === 0 && staked === 0) {
        return result;
    }
    if (inWallet >= staked && inWallet >= escrowedBalance) {
        result.inWallet = 100;
        result.staked = (Math.log(staked) / Math.log(inWallet)) * 100;
        result.escrowed = (Math.log(escrowedBalance) / Math.log(inWallet)) * 100;
    } else if (staked >= inWallet && staked >= escrowedBalance) {
        result.staked = 100;
        result.inWallet = (Math.log(inWallet) / Math.log(staked)) * 100;
        result.escrowed = (Math.log(escrowedBalance) / Math.log(staked)) * 100;
    } else if (escrowedBalance >= staked && escrowedBalance >= inWallet) {
        result.escrowed = 100;
        result.staked = (Math.log(staked) / Math.log(escrowedBalance)) * 100;
        result.inWallet = (Math.log(inWallet) / Math.log(escrowedBalance)) * 100;
    }

    return result;
};

export default ThalesBalance;
