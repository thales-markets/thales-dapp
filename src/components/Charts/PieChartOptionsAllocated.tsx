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
import { getStableCoinForNetwork } from '../../utils/currency';

type PieChartProps = {
    claimable?: number;
};

const PieChartOptionsAllocated: React.FC<PieChartProps> = ({ claimable }) => {
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
        { name: getStableCoinForNetwork(network.networkId), value: sUSDBalance, color: '#8208FC' },
        { name: 'claimable', value: claimable, color: '#50CE99' },
    ];

    return (
        <>
            {isWalletConnected && claimable !== undefined && (
                <ChartContainer>
                    <BalanceInfoContainer>
                        <Header>{getStableCoinForNetwork(network.networkId)} in Wallet:</Header>
                        <SubHeader>
                            {formatCurrencyWithKey(getStableCoinForNetwork(network.networkId), sUSDBalance, 2)}
                        </SubHeader>
                        <Header>Claimable: </Header>
                        <SubHeader>
                            {formatCurrencyWithKey(getStableCoinForNetwork(network.networkId), claimable)}
                        </SubHeader>
                    </BalanceInfoContainer>
                    <PieChart width={getSize()} height={getSize()}>
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

const getSize = () => {
    if (window.innerWidth <= 500) {
        return 174;
    }
    if (window.innerWidth <= 768) {
        return 230;
    }

    return 330;
};
const ChartContainer = styled.div`
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
    padding-top: 10px;
`;

const Header = styled.p`
    text-transform: uppercase;
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: var(--primary-color);
    @media (max-width: 768px) {
        font-size: 10px;
        line-height: 12px;
    }
`;

const SubHeader = styled.p`
    font-family: Roboto !important;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0.035em;
    text-align: center;
    margin-bottom: 10px;
    @media (max-width: 768px) {
        font-size: 18px;
        line-height: 20px;
    }
`;

export default PieChartOptionsAllocated;
