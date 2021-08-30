import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useSnxStakingUserTransactionsQuery from 'queries/token/useUserClaimTransactionsQuery';
import TransactionsWithFilters from './TransactionsWithFilters';
import { EarnSection, SectionHeader } from '../../components';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ClaimTransaction } from 'types/token';

const YourTransactions: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const userClaimTransactionsQuery = useSnxStakingUserTransactionsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const userClaimTransactions = useMemo(
        () =>
            userClaimTransactionsQuery.isSuccess && userClaimTransactionsQuery.data
                ? userClaimTransactionsQuery.data.filter(
                      (tx: ClaimTransaction) => tx.type === 'retroAirdrop' || tx.type === 'retroRewards'
                  )
                : [],
        [userClaimTransactionsQuery.data, walletAddress]
    );
    return (
        <Container>
            <SectionHeader>{t('options.earn.snx-stakers.table.title')}</SectionHeader>
            <TransactionsWithFilters
                transactions={userClaimTransactions}
                isLoading={userClaimTransactionsQuery.isLoading}
            />
        </Container>
    );
};

const Container = styled(EarnSection)`
    grid-column: span 10;
    height: 400px;
`;

export default YourTransactions;
