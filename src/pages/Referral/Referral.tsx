import React, { useMemo, useState } from 'react';

import {
    DescriptionContainer,
    FormWrapper,
    HeaderContainer,
    KeyValue,
    Label,
    StatisticsWrapper,
    StatLabel,
    StatValue,
    TableWrapper,
    Text,
} from './styled-components';
// import InputWithIcon from 'components/InputWithIcon';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import Table from 'components/TableV2';
import { formatTxTimestamp } from 'utils/formatters/date';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { truncateAddress } from 'utils/formatters/string';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import Container from 'pages/Leaderboard/styled-components';
import useReferralTransactionsQuery, { ReferralTransactions } from 'queries/referral/useReferralTransactionsQuery';
import useReferredTradersQuery, { ReferredTrader } from 'queries/referral/useReferredTradersQuery';

const Tabs = [
    {
        id: 0,
        i18label: 'referral-page.tabs.labels.all-transactions',
    },
    {
        id: 1,
        i18label: 'referral-page.tabs.labels.by-trader',
    },
];

const Referral: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    // const [walletAddress, setWalletAddress] = useState<string>('');
    const [tabIndex, setTabIndex] = useState<number>(Tabs[0].id);
    const { t } = useTranslation();

    const transactionsQuery = useReferralTransactionsQuery(
        networkId,
        undefined,
        walletAddress ? walletAddress : undefined,
        {
            enabled: !!walletAddress && isAppReady,
        }
    );

    const tradersQuery = useReferredTradersQuery(networkId, walletAddress ? walletAddress : undefined, {
        enabled: !!walletAddress && isAppReady,
    });

    const transactionData: ReferralTransactions[] | [] = useMemo(() => {
        if (transactionsQuery.isSuccess && transactionsQuery.data && walletAddress) {
            return transactionsQuery.data;
        }

        return [];
    }, [transactionsQuery.isSuccess]);

    const tradersData: ReferredTrader[] | [] = useMemo(() => {
        if (tradersQuery.isSuccess && tradersQuery.data && walletAddress) {
            return tradersQuery.data;
        }

        return [];
    }, [tradersQuery.isSuccess]);

    const statisticsData = useMemo(() => {
        const data = {
            trades: 0,
            totalVolume: 0,
            totalEarned: 0,
        };

        if (transactionData?.length) {
            transactionData.forEach((transaction) => {
                data.trades += 1;
                data.totalVolume += transaction.volume;
                data.totalEarned += transaction.amount;
            });
        }

        return data;
    }, [transactionData]);

    // const dummyData = [
    //     {
    //         address: '0x1633e96fd8d8b4f3653fef8daf9f051cd4f82804',
    //         volume: 38299.59,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 901.36,
    //         timestamp: 1623878317000,
    //     },
    //     {
    //         address: '0x98aa4f09a81784bfb7023cb70b9a84f29ebb0a84',
    //         volume: 61717.34,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 274.75,
    //         timestamp: 1635984065000,
    //     },
    //     {
    //         address: '0xee8d4948fc976bc41b9bd79506f6a63e56c338bf',
    //         volume: 19197.4,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 552.43,
    //         timestamp: 1628609045000,
    //     },
    //     {
    //         address: '0x816fa87eabc5d4166397da7033ece2ca5802b09b',
    //         volume: 58997.42,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 118.38,
    //         timestamp: 1648764115000,
    //     },
    //     {
    //         address: '0xcc093a40e38fb72a1d8a28c734e6053cb30f75df',
    //         volume: 71698.19,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 181.83,
    //         timestamp: 1646532868000,
    //     },
    //     {
    //         address: '0x1d675334f4354acb7b2655741246390a9c663f80',
    //         volume: 8855.45,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 857.78,
    //         timestamp: 1650868224000,
    //     },
    //     {
    //         address: '0xc679fe867fbff7fe74ac11b9bc182768c1f45213',
    //         volume: 13842.73,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 633.21,
    //         timestamp: 1640680273000,
    //     },
    //     {
    //         address: '0x5bb093d76b88eed09039d895a21aa49268779451',
    //         volume: 17116.3,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 123.17,
    //         timestamp: 1641184192000,
    //     },
    //     {
    //         address: '0x720209b94af7aaec2030a9af87015c60f37394c9',
    //         volume: 26099.79,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 858.1,
    //         timestamp: 1637267994000,
    //     },
    //     {
    //         address: '0xecdc2486988fd661a8ee2783f5b99ca7608e6621',
    //         volume: 29155.78,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 332.8,
    //         timestamp: 1647762309000,
    //     },
    //     {
    //         address: '0x7823eaceca078fd067195d9b8013d156825894b1',
    //         volume: 45335.67,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 304.93,
    //         timestamp: 1634337673000,
    //     },
    //     {
    //         address: '0x0b4f45ee4829d7156760c3a003385daa35e166f8',
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         volume: 17500.54,
    //         earned: 213.74,
    //         timestamp: 1635013890000,
    //     },
    //     {
    //         address: '0xdcc96e46690eecac3daadbf0280d8196dbe1fd5a',
    //         volume: 56775.59,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 830.24,
    //         timestamp: 1644581237000,
    //     },
    //     {
    //         address: '0xddea68755dba1d4ecc6979e15d111b834c21f479',
    //         volume: 32769.49,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 152.54,
    //         timestamp: 1623709887000,
    //     },
    //     {
    //         address: '0xfb42c724a8167e669b1ce71ab0f0bd4357b484c6',
    //         volume: 94229.96,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         earned: 394.37,
    //         timestamp: 1651921979000,
    //     },
    //     {
    //         address: '0x3071c8d814829986729c4aefecf36542fb2ac2ac',
    //         volume: 12720.88,
    //         earned: 424.59,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         timestamp: 1630447935000,
    //     },
    //     {
    //         address: '0x3c8480d1514ed6539482063e9c8af7ee82de4130',
    //         volume: 14082.4,
    //         earned: 494.39,
    //         timestamp: 1642064949000,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //     },
    //     {
    //         address: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //         volume: 59245.1,
    //         earned: 564.87,
    //         timestamp: 1647671686000,
    //         hash: '0xde46a42786bd64fa4013e9591d37b2451d98ac5c',
    //     },
    //     {
    //         address: '0x831992eb8079a4b124b33cbb8ec4454fa1aebe46',
    //         volume: 14732.66,
    //         earned: 104.28,
    //         timestamp: 1640959778000,
    //         hash: '0xf9f733fe842d49e27fcbf665732b6ed04353b1a7',
    //     },
    //     {
    //         address: '0xf9f733fe842d49e27fcbf665732b6ed04353b1a7',
    //         volume: 37304.17,
    //         earned: 405.02,
    //         timestamp: 1646273757000,
    //         hash: '0xf9f733fe842d49e27fcbf665732b6ed04353b1a7',
    //     },
    // ];

    return (
        <>
            <HeaderContainer>
                <FormWrapper>
                    <Label>{t('referral-page.form-label')}</Label>
                    <Button
                        padding={'5px 0px'}
                        margin={'9px 0px 16px 0'}
                        active={true}
                        hoverShadow={'var(--button-shadow)'}
                    >
                        {t('referral-page.generate-link-btn')}
                    </Button>
                    {/* <InputWithIcon
                        placeholder={'Enter wallet address'}
                        text={walletAddress}
                        handleChange={(value) => setWalletAddress(value)}
                    /> */}
                </FormWrapper>
                <StatisticsWrapper>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.trades')}</StatLabel>
                        <StatValue>{statisticsData.trades}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.total-volume')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, statisticsData.totalVolume, 2)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.earned')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, statisticsData.totalEarned, 2)}</StatValue>
                    </KeyValue>
                </StatisticsWrapper>
                <DescriptionContainer>
                    <Text>{t('referral-page.description')}</Text>
                </DescriptionContainer>
            </HeaderContainer>
            <Container.Main justifyContent="flex-start" hide={false}>
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 0}
                    onClick={() => setTabIndex(Tabs[0].id)}
                >
                    {t(Tabs[0].i18label)}
                </Container.Main.Item>
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 1}
                    onClick={() => setTabIndex(Tabs[1].id)}
                >
                    {t(Tabs[1].i18label)}
                </Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <>
                    {tabIndex == Tabs[0].id && (
                        <TableWrapper>
                            <Table
                                data={transactionData}
                                defaultPage={10}
                                columns={[
                                    {
                                        Header: <>{t('referral-page.table.address')}</>,
                                        accessor: 'trader',
                                        Cell: (cellProps: any) => <p>{truncateAddress(cellProps.cell.value)}</p>,
                                        disableSortBy: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.volume')}</>,
                                        accessor: 'volume',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                        ),
                                        sortable: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.earned')}</>,
                                        accessor: 'amount',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                        ),
                                        sortable: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.transaction-date')}</>,
                                        accessor: 'timestamp',
                                        Cell: (cellProps: any) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
                                        sortable: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.tx-info')}</>,
                                        accessor: 'id',
                                        disableSortBy: true,
                                        Cell: (cellProps: any) => <ViewEtherscanLink hash={cellProps.cell.value} />,
                                    },
                                ]}
                            />
                        </TableWrapper>
                    )}
                    {tabIndex == Tabs[1].id && (
                        <TableWrapper>
                            <Table
                                data={tradersData}
                                defaultPage={10}
                                columns={[
                                    {
                                        id: 'index',
                                        Header: <>{t('referral-page.table.index')}</>,
                                        Cell: (cellProps: any) => {
                                            return <p>{cellProps?.row?.id ? Number(cellProps?.row?.id) + 1 : ''}</p>;
                                        },
                                        disableSortBy: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.address')}</>,
                                        accessor: 'id',
                                        Cell: (cellProps: any) => <p>{truncateAddress(cellProps.cell.value)}</p>,
                                        disableSortBy: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.trades')}</>,
                                        accessor: 'trades',
                                        Cell: (cellProps: any) => <p>{cellProps.cell.value}</p>,
                                        sortable: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.total-volume')}</>,
                                        accessor: 'totalVolume',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                        ),
                                        sortable: true,
                                    },
                                    {
                                        Header: <>{t('referral-page.table.total-earned')}</>,
                                        accessor: 'totalEarned',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                        ),
                                        sortable: true,
                                    },
                                ]}
                            />
                        </TableWrapper>
                    )}
                </>
            </Container.Tab>
        </>
    );
};

export default Referral;
