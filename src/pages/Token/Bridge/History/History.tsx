import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import HistoryTable from '../HistoryTable';
import useCelerBridgeUserHistoryQuery from 'queries/token/useCelerBridgeUserHistoryQuery';
import { CelerBridgeHistory } from 'types/token';

const History: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [userHistory, setUserHistory] = useState<CelerBridgeHistory>([]);

    const celerBridgeUserHistoryQuery = useCelerBridgeUserHistoryQuery(walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (celerBridgeUserHistoryQuery.isSuccess && celerBridgeUserHistoryQuery.data) {
            setUserHistory(celerBridgeUserHistoryQuery.data);
        } else {
            setUserHistory([]);
        }
    }, [celerBridgeUserHistoryQuery.isSuccess, celerBridgeUserHistoryQuery.data, walletAddress]);

    const noUserHistory = userHistory.length === 0;

    return (
        <Container>
            <Title>{t('thales-token.bridge.history.title')}</Title>
            <TableContainer>
                <HistoryTable
                    transactions={userHistory}
                    isLoading={celerBridgeUserHistoryQuery.isLoading}
                    noResultsMessage={
                        noUserHistory ? <span>{t(`thales-token.bridge.history.no-history`)}</span> : undefined
                    }
                />
            </TableContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    position: relative;
    max-height: 370px;
    min-height: 370px;
    overflow-y: auto;
    width: 70%;
    margin-top: 20px;
    @media (max-width: 1440px) {
        width: 95%;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-height: 1100px;
        min-height: initial;
    }
`;

const Title = styled(FlexDivRow)`
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
    }
`;

const TableContainer = styled(FlexDivColumn)`
    overflow: auto;
`;

export default History;
