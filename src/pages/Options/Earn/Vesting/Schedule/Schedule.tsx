import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { EarnSection, SectionHeader } from '../../components';
import ScheduleTable from './ScheduleTable';
import useVestingScheduleQuery from 'queries/token/useVestingScheduleQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';

const Schedule: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const { escrowThalesContract, stakingThalesContract } = snxJSConnector as any;

    const vestingScheduleQuery = useVestingScheduleQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!escrowThalesContract && !!stakingThalesContract,
    });

    const vestingSchedule = [
        { date: 1501515151515, amount: 200 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
        { date: 1501515151515, amount: 100 },
    ]; // TODO remove

    const noResults = vestingSchedule.length === 0;
    const isMobileOrTablet = window.innerWidth < 1025;

    return (
        <SectionContainer>
            <StyledSectionHeader>{t('options.earn.vesting.schedule.title')}</StyledSectionHeader>
            <SectionContent isMobileOrTablet={isMobileOrTablet}>
                <ScheduleTable
                    schedule={vestingSchedule}
                    isLoading={vestingScheduleQuery.isLoading}
                    noResultsMessage={
                        noResults ? <span>{t(`options.earn.vesting.schedule.table.no-results`)}</span> : undefined
                    }
                    tableHeadCellStyles={
                        isMobileOrTablet
                            ? {
                                  fontSize: '16px',
                                  color: '#b8c6e5',
                                  backgroundColor: '#04045a',
                                  marginTop: '-1px',
                              }
                            : {}
                    }
                    tableRowCellStyles={isMobileOrTablet ? { fontSize: '16px', color: '#F6F6FE' } : {}}
                />
            </SectionContent>
        </SectionContainer>
    );
};

const StyledSectionHeader = styled(SectionHeader)`
    @media (max-width: 1025px) {
        display: none;
    }
`;

const SectionContainer = styled(EarnSection)`
    grid-column: span 10;
    grid-row: span 3;
    height: 400px;
    margin-bottom: 0;
    @media (max-width: 767px) {
        padding: 10px 0 10px 0;
    }
`;

const SectionContent = styled(FlexDivColumn)<{ isMobileOrTablet: boolean }>`
    height: ${(props) => (props.isMobileOrTablet ? '100%' : 'calc(100% - 50px)')};
`;

export default Schedule;
