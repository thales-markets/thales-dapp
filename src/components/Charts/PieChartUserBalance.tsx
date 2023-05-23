import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import styled from 'styled-components';

import { THALES_CURRENCY } from 'constants/currency';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress, getNetworkId } from 'redux/modules/wallet';

import useThalesBalanceQuery from '../../queries/walletBalances/useThalesBalanceQuery';

import { getCurrencyKeyStableBalance } from 'utils/balances';

import { formatCurrencyWithKey } from 'utils/formatters/number';
import useEthBalanceQuery from 'queries/walletBalances/useEthBalanceQuery';
import useOpThalesBalanceQuery from '../../queries/walletBalances/useOpThalesBalanceQuery';
import { getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon } from '../../utils/network';
import { getMainCurrencyForNetwork, getStableCoinForNetwork } from '../../utils/currency';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';

const PieChartUserBalance: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const showThalesBalance = !getIsPolygon(networkId) && !getIsArbitrum(networkId) && !getIsBSC(networkId);

    const [thalesBalance, setThalesBalance] = useState(0);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && walletAddress !== '',
    });

    const stableBalance = stableBalanceQuery?.isSuccess && stableBalanceQuery?.data ? stableBalanceQuery.data : null;
    const balance = getCurrencyKeyStableBalance(stableBalance, getStableCoinForNetwork(networkId));

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isL2,
    });

    const opThalesBalanceQuery = useOpThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isL2,
    });

    const ethBalanceQuery = useEthBalanceQuery(walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const ethBalance = ethBalanceQuery.isSuccess ? ethBalanceQuery.data : 0;

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    useEffect(() => {
        if (opThalesBalanceQuery.isSuccess && opThalesBalanceQuery.data && !isL2) {
            setThalesBalance(Number(opThalesBalanceQuery.data.balance));
        }
    }, [opThalesBalanceQuery.isSuccess, opThalesBalanceQuery.data]);

    const data =
        balance || thalesBalance
            ? !showThalesBalance
                ? [{ name: 'sUSD', value: balance ? balance : 4000, color: '#50CE99' }]
                : [
                      { name: 'sUSD', value: balance ? balance : 4000, color: '#50CE99' },
                      { name: 'thales', value: thalesBalance ? thalesBalance : 600, color: '#8208FC' },
                  ]
            : [{ name: 'No data', value: 1, color: '#8181ac' }];

    return (
        <>
            {isWalletConnected && (
                <ChartContainer>
                    <BalanceInfoContainer>
                        <PartialAmount>
                            {formatCurrencyWithKey(getMainCurrencyForNetwork(networkId), ethBalance)}
                        </PartialAmount>
                        <PartialAmount>
                            {formatCurrencyWithKey(getStableCoinForNetwork(networkId), balance)}
                        </PartialAmount>
                        {showThalesBalance && (
                            <ThalesAmount>{formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}</ThalesAmount>
                        )}
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
    color: ${(props) => props.theme.textColor.primary};
`;

const PartialAmount = styled.p`
    font-weight: 600;
    font-size: 17px;
    line-height: 19px;
`;

const ThalesAmount = styled(PartialAmount)`
    text-transform: uppercase;
`;
export default PieChartUserBalance;
