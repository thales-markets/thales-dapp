import TileTable from 'components/TileTable';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import generateRows from './utils/generateRows';
import { UserPosition } from 'queries/user/useAllPositions';

type HistoryProps = {
    claimedPositions: UserPosition[];
    ripPositions: UserPosition[];
    searchText: string;
    isLoading?: boolean;
};

const History: React.FC<HistoryProps> = ({ claimedPositions, ripPositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const data = useMemo(() => [...claimedPositions, ...ripPositions], [claimedPositions, ripPositions]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter((value: UserPosition) => {
            return value.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }, [searchText, data]);

    const rows = useMemo(() => {
        if (filteredData.length) {
            return generateRows(filteredData, t, theme);
        }
        return [];
    }, [filteredData]);

    return <TileTable rows={rows as any} isLoading={isLoading} defaultFlowColor={theme.background.tertiary} />;
};

export default History;
