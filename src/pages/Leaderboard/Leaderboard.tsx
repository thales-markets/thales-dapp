import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';

import useLeaderboardQuery from 'queries/leaderboard/useLeaderboardQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import Container from 'pages/AMMTrading/components//TabContainer/styled-components/Container';

import { Image } from 'theme/common';
import { UI_COLORS } from 'constants/ui';
import { orderBy } from 'lodash';

type Competition = 'byNetProfit' | 'percetangeGain';

const CompetitionTabs = [
    {
        type: 'byNetProfit',
        i18Label: 'options.leaderboard.trading-competition.net-profit-competition',
    },
    {
        type: 'percetangeGain',
        i18Label: 'options.leaderboard.trading-competition.percentage-profit-competition',
    },
];

const Leaderboard: React.FC = () => {
    const { t } = useTranslation();
    const [competitionType, setCompetitionType] = useState<Competition>('byNetProfit');
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const query = useLeaderboardQuery(networkId, { enabled: isAppReady });

    const data = useMemo(() => {
        if (query.isSuccess) {
            let users = query?.data?.length ? query.data : [];

            if (competitionType == 'byNetProfit') {
                users = orderBy(users, ['profit'], ['desc']);
            }

            if (competitionType == 'percetangeGain') {
                users = orderBy(users, ['gain'], ['desc']);
            }
            users.forEach((user, index) => (user['rank'] = index + 1));

            return users;
        }

        return [];
    }, [query.isSuccess, competitionType]);

    return (
        <>
            <Wrapper>
                <Container.Main justifyContent="flex-start">
                    <Container.Main.Item
                        noStrech={true}
                        padding={'20px 30px'}
                        active={CompetitionTabs[0].type == competitionType}
                        onClick={() => setCompetitionType(CompetitionTabs[0].type as Competition)}
                    >
                        {t(CompetitionTabs[0].i18Label)}
                    </Container.Main.Item>
                    <Container.Main.Item
                        noStrech={true}
                        padding={'20px 30px'}
                        active={CompetitionTabs[1].type == competitionType}
                        onClick={() => setCompetitionType(CompetitionTabs[1].type as Competition)}
                    >
                        {t(CompetitionTabs[1].i18Label)}
                    </Container.Main.Item>
                </Container.Main>
                <Container.Tab>
                    <Table
                        data={data}
                        columns={[
                            {
                                Header: t('options.leaderboard.table.rank-col'),
                                accessor: 'rank',
                                Cell: (cellProps: any) => <Position position={cellProps?.cell?.value} />,
                            },
                            {
                                Header: t('options.leaderboard.avatar'),
                                accessor: 'avatar',
                                Cell: (cellProps: any) => <UserAvatar src={cellProps.cell.value} />,
                            },
                            {
                                Header: t('options.leaderboard.display-name'),
                                accessor: 'name',
                            },
                            {
                                Header: t('options.leaderboard.table.netprofit-col'),
                                accessor: 'profit',
                                Cell: (cellProps: any) => (
                                    <Gain color={cellProps.cell.value > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}>
                                        {formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}
                                    </Gain>
                                ),
                                sortType: 'basic',
                                sortable: true,
                            },
                            {
                                Header: t('options.leaderboard.table.gain-col'),
                                accessor: 'gain',
                                Cell: (cellProps: any) => (
                                    <Gain color={cellProps.cell.value > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}>
                                        {formatPercentage(cellProps.cell.value)}
                                    </Gain>
                                ),
                                sortType: 'basic',
                                sortable: true,
                            },
                            {
                                Header: t('options.leaderboard.table.trades-col'),
                                accessor: 'trades',
                            },
                            {
                                Header: t('options.leaderboard.table.volume-col'),
                                accessor: 'volume',
                                Cell: (cellProps: any) => (
                                    <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                ),
                                sortable: false,
                            },
                            {
                                Header: t('options.leaderboard.table.investment-col'),
                                accessor: 'investment',
                                Cell: (cellProps: any) => (
                                    <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                ),
                            },
                        ]}
                        leaderboardView={true}
                    />
                </Container.Tab>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    width: auto;
`;

const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: 5px 0px;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

const Gain = styled.p<{ color?: string }>`
    color: ${(_props) => (_props?.color ? _props.color : '')};
`;

const Position: React.FC<{ position: number }> = ({ position }) => {
    return (
        <>
            {position == 1 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--first-place"
                />
            )}
            {position == 2 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--second-place"
                />
            )}
            {position == 3 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--third-place"
                />
            )}
            {position > 3 && <span>{position}</span>}
        </>
    );
};

export default Leaderboard;
