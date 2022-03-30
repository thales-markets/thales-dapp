import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import styled from 'styled-components';

import { SYNTHS_MAP, THALES_CURRENCY } from 'constants/currency';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetwork, getWalletAddress, getNetworkId } from 'redux/modules/wallet';

import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import useThalesBalanceQuery from '../../queries/walletBalances/useThalesBalanceQuery';

import { getCurrencyKeyBalance } from 'utils/balances';

import { formatCurrencyWithKey } from 'utils/formatters/number';
import useEthBalanceQuery from 'queries/walletBalances/useEthBalanceQuery';

const PieChartUserBalance: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [thalesBalance, setThalesBalance] = useState(0);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const ethBalanceQuery = useEthBalanceQuery(walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const ethBalance = ethBalanceQuery.isSuccess ? ethBalanceQuery.data : 0;

    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    const data =
        sUSDBalance || thalesBalance
            ? [
                  { name: 'sUSD', value: sUSDBalance ? sUSDBalance : 4000, color: '#50CE99' },
                  { name: 'thales', value: thalesBalance ? thalesBalance : 600, color: '#8208FC' },
              ]
            : [{ name: 'No data', value: 1, color: '#8181ac' }];

    return (
        <>
            {isWalletConnected && (
                <ChartContainer>
                    <BalanceInfoContainer>
                        <PartialAmount>{formatCurrencyWithKey('ETH', ethBalance)}</PartialAmount>
                        <PartialAmount>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</PartialAmount>
                        <ThalesAmount>{formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}</ThalesAmount>
                    </BalanceInfoContainer>
                    <PieChart style={{ margin: 'auto' }} width={180} height={180}>
                        <Pie
                            startAngle={-45}
                            cornerRadius={20}
                            stroke="none"
                            data={data}
                            innerRadius={'85%'}
                            outerRadius={'100%'}
                            fill="#82ca9d"
                            paddingAngle={-10}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <h2>Test</h2>
                    </PieChart>
                </ChartContainer>
            )}
        </>
    );
};

const ChartContainer = styled.div`
    width: 180px;
    height: 180px;
    position: relative;
    margin: 0px auto 15px auto;
`;

const BalanceInfoContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: absolute;
    color: var(--icon-color);
`;

const PartialAmount = styled.p`
    font-family: Roboto !important;
    font-weight: 600;
    font-size: 17px;
    line-height: 19px;
`;

const ThalesAmount = styled(PartialAmount)`
    text-transform: uppercase;
`;
export default PieChartUserBalance;
