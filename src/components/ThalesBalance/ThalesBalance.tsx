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
    });

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const inWallet = thalesBalanceQuery.isSuccess ? thalesBalanceQuery.data.balance : 0;
    const staked = stakingThalesQuery.isSuccess ? stakingThalesQuery.data.thalesStaked : 0;
    const escrowedBalance = escrowThalesQuery.isSuccess ? escrowThalesQuery.data.escrowedBalance : 0;

    const proportions = useMemo(() => {
        return calculateWidth(inWallet, staked, escrowedBalance);
    }, [inWallet, staked, escrowedBalance]);

    return (
        <Wrapper>
            {showTitle && <Title>My Thales:</Title>}
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
`;

const Bar = styled.div<{ width: number; background: string }>`
    display: flex;
    min-width: 50%;
    width: ${(props) => props.width + '%'};
    justify-content: space-between;
    align-items: center;
    border-radius: 11px;
    margin-bottom: 4px;
    background: ${(props) => props.background};
    padding: 0 10px;
`;

const Label = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 21px;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
`;

const Amount = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    line-height: 18px;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
`;

const calculateWidth = (inWallet: number, staked: number, escrowedBalance: number) => {
    const result = { inWallet: 0, staked: 0, escrowed: 0 };
    if (inWallet >= staked && inWallet >= escrowedBalance) {
        result.inWallet = 100;

        if (staked > escrowedBalance) {
            result.escrowed = Number(((100 * escrowedBalance) / staked / 2).toFixed(0));
            result.staked = 100 - result.escrowed;
            // result.staked = 85;
        } else {
            result.staked = Number(((100 * staked) / escrowedBalance / 2).toFixed(0));
            result.escrowed = 100 - result.staked;
            // result.escrowed = 85;
        }
    } else if (staked >= inWallet && staked >= escrowedBalance) {
        result.staked = 100;
        if (inWallet > escrowedBalance) {
            result.escrowed = Number(((100 * escrowedBalance) / inWallet / 2).toFixed(0));
            result.inWallet = 100 - result.escrowed;
            // result.inWallet = 85;
        } else {
            result.inWallet = Number(((100 * inWallet) / escrowedBalance / 2).toFixed(0));
            result.escrowed = 100 - result.inWallet;
            // result.escrowed = 85;
        }
    } else if (escrowedBalance >= staked && escrowedBalance >= inWallet) {
        result.escrowed = 100;
        if (staked > inWallet) {
            result.inWallet = Number(((100 * inWallet) / staked / 2).toFixed(0));
            result.staked = 100 - result.inWallet;
            // result.staked = 85;
        } else {
            result.staked = Number(((100 * staked) / inWallet / 2).toFixed(0));
            result.inWallet = 100 - result.staked;
            // result.inWallet = 85;
        }
    }
    return result;
};

export default ThalesBalance;
