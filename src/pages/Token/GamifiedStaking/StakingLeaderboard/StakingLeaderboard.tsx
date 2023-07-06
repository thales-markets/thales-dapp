import Table from 'components/TableV3/Table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StakingLeaderboard: React.FC = () => {
    const { t } = useTranslation();
    console.log(DummyData);

    const columns = [
        {
            id: 'rank',
            Header: <TableText>{t(`markets.table.strike-range-col`)}</TableText>,

            accessor: (row: any) => {
                console.log(row);
                return <TableText>{row.rank}</TableText>;
            },
        },
        {
            id: 'address',
            Header: <TableText>{t(`markets.table.strike-range-col`)}</TableText>,

            accessor: (row: any) => {
                console.log(row);
                return <TableText>{row.address}</TableText>;
            },
        },
        {
            id: 'points',
            Header: <TableText>{t(`markets.table.strike-range-col`)}</TableText>,

            accessor: (row: any) => {
                console.log(row);
                return <TableText>{row.points}</TableText>;
            },
        },
        {
            id: 'multiplier',
            Header: <TableText>{t(`markets.table.strike-range-col`)}</TableText>,

            accessor: (row: any) => {
                console.log(row);
                return <TableText>{row.multiplier}</TableText>;
            },
        },
        {
            id: 'rewards',
            Header: <TableText>{t(`markets.table.strike-range-col`)}</TableText>,

            accessor: (row: any) => {
                console.log(row);
                return <TableText>{row.rewards}</TableText>;
            },
        },
    ];
    return (
        <Wrapper>
            <Table columns={columns} data={DummyData}></Table>
        </Wrapper>
    );
};

export default StakingLeaderboard;

const Wrapper = styled.div`
    width: 100%;
`;

const TableText = styled.p`
    color: #fff;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
`;

const DummyData = [
    {
        rank: 1,
        address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
        points: '5000',
        multiplier: '1.5',
        rewards: '500',
    },
    {
        rank: 2,
        address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
        points: '5000',
        multiplier: '1.5',
        rewards: '500',
    },
    {
        rank: 3,
        address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
        points: '5000',
        multiplier: '1.5',
        rewards: '500',
    },
    {
        rank: 4,
        address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
        points: '5000',
        multiplier: '1.5',
        rewards: '500',
    },
    {
        rank: 5,
        address: '0x1654da196a494r9a165a1g6aer16ae4rg94196165',
        points: '5000',
        multiplier: '1.5',
        rewards: '500',
    },
];
