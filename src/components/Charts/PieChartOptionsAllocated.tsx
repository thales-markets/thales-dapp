import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import styled from 'styled-components';

import { SYNTHS_MAP } from 'constants/currency';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';

import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';

import { getCurrencyKeyBalance } from 'utils/balances';

import { formatCurrencyWithKey } from 'utils/formatters/number';

const PieChartOptionsAllocated: React.FC<{ claimable?: number; allocated?: number }> = ({ claimable, allocated }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;

    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const data = [
        { name: 'sUSD', value: sUSDBalance, color: '#8208FC' },
        { name: 'claimable', value: claimable, color: '#8181ac' },
        { name: 'maxReturn', value: allocated, color: '#50CE99' },
    ];

    return (
        <>
            {isWalletConnected && claimable !== undefined && allocated !== undefined && (
                <ChartContainer>
                    <BalanceInfoContainer>
                        <Header>sUSD in Wallet:</Header>
                        <SubHeader>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</SubHeader>
                        <Header>Claimable: </Header>
                        <SubHeader>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, claimable)}</SubHeader>
                        <Header>Max Return: </Header>
                        <SubHeader>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, allocated)}</SubHeader>
                    </BalanceInfoContainer>
                    <PieChart width={450} height={450}>
                        <Pie
                            startAngle={-45}
                            cornerRadius={20}
                            stroke="none"
                            data={data}
                            innerRadius={'85%'}
                            outerRadius={'100%'}
                            paddingAngle={-10}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            )}
        </>
    );
};

const ChartContainer = styled.div`
    width: 450px;
    height: 450px;
    position: relative;
    margin: 0px auto 15px auto;
`;

const BalanceInfoContainer = styled.div`
    left: 0;
    right: 0;
    margin: auto;
    position: absolute;
    color: var(--icon-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.p`
    text-transform: uppercase;
    font-family: Titillium Regular !important;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
`;

const SubHeader = styled.p`
    font-family: Titillium Regular !important;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0.035em;
    text-align: center;
    margin-bottom: 10px;
`;

export default PieChartOptionsAllocated;
