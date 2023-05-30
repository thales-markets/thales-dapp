import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import styled, { useTheme } from 'styled-components';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';

import { getCurrencyKeyStableBalance } from 'utils/balances';

import { formatCurrencyWithKey } from 'utils/formatters/number';
import { getStableCoinForNetwork } from '../../utils/currency';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import { useTranslation } from 'react-i18next';
import { getIsMobile } from 'redux/modules/ui';
import { ScreenSizeBreakpoint } from 'constants/ui';
import { ThemeInterface } from 'types/ui';

type PieChartProps = {
    claimable?: number;
};

const PieChartOptionsAllocated: React.FC<PieChartProps> = ({ claimable }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const walletBalancesQuery = useStableBalanceQuery(walletAddress, network.networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        walletBalancesQuery.isSuccess && walletBalancesQuery.data ? walletBalancesQuery.data : null;

    const sUSDBalance = getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(network.networkId)) || 0;

    const data = [
        { name: getStableCoinForNetwork(network.networkId), value: sUSDBalance, color: theme.textColor.secondary },
        { name: 'claimable', value: claimable, color: theme.textColor.quaternary },
    ];

    return (
        <>
            {isWalletConnected && claimable !== undefined && (
                <ChartContainer>
                    <BalanceInfoContainer>
                        <Header>
                            {getStableCoinForNetwork(network.networkId) +
                                ' ' +
                                t('options.trading-profile.chart-info.in-wallet')}
                            :
                        </Header>
                        <SubHeader color={theme.textColor.secondary}>
                            {formatCurrencyWithKey(getStableCoinForNetwork(network.networkId), sUSDBalance, 2)}
                        </SubHeader>
                        <Header>{t('options.trading-profile.chart-info.claimable')}:</Header>
                        <SubHeader color={theme.textColor.quaternary}>
                            {formatCurrencyWithKey(getStableCoinForNetwork(network.networkId), claimable)}
                        </SubHeader>
                    </BalanceInfoContainer>
                    <PieChart width={getSize(isMobile)} height={getSize(isMobile)}>
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

const getSize = (isMobile: boolean) => {
    if (window.innerWidth <= 500) {
        return 174;
    }
    if (isMobile) {
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
    color: ${(props) => props.theme.textColor.primary};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 10px;
`;

const Header = styled.p`
    font-weight: 600;
    font-size: 21px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.035em;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        font-size: 10px;
        line-height: 12px;
    }
`;

const SubHeader = styled.p<{ color?: string }>`
    ${(props) => (props.color ? `color: ${props.color}` : '')};
    font-size: 32px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0.035em;
    text-align: center;
    margin-bottom: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        font-size: 18px;
        line-height: 20px;
    }
`;

export default PieChartOptionsAllocated;
