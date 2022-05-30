import React, { useMemo, useState } from 'react';

import {
    DescriptionContainer,
    FormWrapper,
    HeaderContainer,
    KeyValue,
    Label,
    RowContrainer,
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
import Checkbox from 'pages/AMMTrading/components/AMM/components/Checkbox';
import LinkModal from './components/LinkModal';
import { buildReferralLink } from 'utils/routes';
import ROUTES from 'constants/routes';

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
    const [landingPage, setLandingPage] = useState<number | undefined>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [referralLink, setReferralLink] = useState<string>('');

    console.log('Location ', window.location);
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
    }, [transactionsQuery.isSuccess, walletAddress]);

    const tradersData: ReferredTrader[] | [] = useMemo(() => {
        if (tradersQuery.isSuccess && tradersQuery.data && walletAddress) {
            return tradersQuery.data;
        }

        return [];
    }, [tradersQuery.isSuccess, walletAddress]);

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

    const generateLinkHandler = () => {
        if (!walletAddress) {
            alert('Connect your wallet first.');
            return;
        }

        if (landingPage == 0) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Options.Home, walletAddress)}`);
        } else if (landingPage == 1) {
            setReferralLink(
                `${window.location.origin}${buildReferralLink(ROUTES.Options.RangeMarkets, walletAddress)}`
            );
        } else {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Home, walletAddress)}`);
        }
        setShowModal(true);
    };

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
                        onClickHandler={generateLinkHandler}
                    >
                        {t('referral-page.generate-link-btn')}
                    </Button>
                    <Label>{t('referral-page.choose-landing')}</Label>
                    <RowContrainer>
                        <Checkbox
                            checked={landingPage == 0}
                            container={{
                                size: '20px',
                                margin: '0 30px 0 0',
                            }}
                            wrapperStyle={{ justifyContent: 'space-between', margin: '0 0 10px 0' }}
                            checkbox={{
                                margin: '0 0 0 10px',
                            }}
                            label={{
                                text: t('referral-page.pages.market-page'),
                                fontSize: '12px',
                            }}
                            // disabled={actionInProgress}
                            onChange={(e: any) => {
                                setLandingPage(e.target.checked ? 0 : undefined);
                            }}
                        />
                        <Checkbox
                            checked={landingPage == 1}
                            container={{
                                size: '20px',
                                margin: '0 30px 0 0',
                            }}
                            wrapperStyle={{ justifyContent: 'space-between' }}
                            checkbox={{
                                margin: '0 0 0 10px',
                            }}
                            label={{
                                text: t('referral-page.pages.range-market-page'),
                                fontSize: '12px',
                            }}
                            // disabled={actionInProgress}
                            onChange={(e: any) => {
                                setLandingPage(e.target.checked ? 1 : undefined);
                            }}
                        />
                    </RowContrainer>
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
            {showModal && <LinkModal showModal={showModal} onClose={() => setShowModal(false)} link={referralLink} />}
        </>
    );
};

export default Referral;
