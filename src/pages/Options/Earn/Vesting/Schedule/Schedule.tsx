import React, { useMemo } from 'react';
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

const Schedule: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const vestingScheduleQuery = useVestingScheduleQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const vestingSchedule = useMemo(
        () => (vestingScheduleQuery.isSuccess && vestingScheduleQuery.data ? vestingScheduleQuery.data : []),
        [vestingScheduleQuery.data]
    );

    const noResults = vestingSchedule.length === 0;

    return (
        <SectionContainer>
            <SectionHeader>{t('options.earn.vesting.schedule.title')}</SectionHeader>
            <SectionContent>
                <ScheduleTable
                    schedule={vestingSchedule}
                    isLoading={vestingScheduleQuery.isLoading}
                    noResultsMessage={
                        noResults ? <span>{t(`options.earn.vesting.schedule.table.no-results`)}</span> : undefined
                    }
                />
            </SectionContent>
        </SectionContainer>
    );
};

const SectionContainer = styled(EarnSection)`
    grid-column: span 10;
    grid-row: span 3;
    height: 400px;
    margin-bottom: 0;
`;

const SectionContent = styled(FlexDivColumn)`
    height: 100%;
`;

export default Schedule;
