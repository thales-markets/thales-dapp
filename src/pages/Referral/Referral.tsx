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
import { Trans, useTranslation } from 'react-i18next';
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
import { buildReferralLink } from 'utils/routes';
import ROUTES from 'constants/routes';
import useReferrerQuery from 'queries/referral/useReferrerQuery';
import { orderBy } from 'lodash';
import SelectInput from 'components/SelectInput';
import InputWithIcon from 'components/InputWithIcon';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { UI_COLORS } from 'constants/ui';
import ReadMoreButton from 'components/ReadMoreButton';

const Tabs = [
    {
        id: 0,
        i18label: 'referral-page.tabs.labels.all-transactions',
    },
    {
        id: 1,
        i18label: 'referral-page.tabs.labels.by-trader',
    },
    {
        id: 2,
        i18label: 'referral-page.tabs.labels.affiliate-leaderboard',
    },
];

const Referral: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    // const [walletAddress, setWalletAddress] = useState<string>('');
    const [tabIndex, setTabIndex] = useState<number>(Tabs[0].id);
    const [landingPage, setLandingPage] = useState<number | undefined>(0);
    const [referralLink, setReferralLink] = useState<string>('');
    const [showMore, setShowMore] = useState<boolean>(false);
    const [textHeight, setHeight] = useState<string>('170px');
    const { t } = useTranslation();

    const landingPageOptions = [
        {
            value: 0,
            label: t('referral-page.pages.market-page'),
        },
        {
            value: 1,
            label: t('referral-page.pages.range-market-page'),
        },
        {
            value: 2,
            label: t('referral-page.pages.landing-page'),
        },
        {
            value: 3,
            label: t('referral-page.pages.token-page'),
        },
        {
            value: 4,
            label: t('referral-page.pages.royale-page'),
        },
        {
            value: 5,
            label: t('referral-page.pages.tale-of-thales'),
        },
        {
            value: 6,
            label: t('referral-page.pages.governance'),
        },
    ];

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
            return orderBy(transactionsQuery.data, ['timestamp'], ['desc']);
        }

        return [];
    }, [transactionsQuery.isSuccess, walletAddress]);

    const tradersData: ReferredTrader[] | [] = useMemo(() => {
        if (tradersQuery.isSuccess && tradersQuery.data && walletAddress) {
            return tradersQuery.data;
        }

        return [];
    }, [tradersQuery.isSuccess, walletAddress]);

    const affiliateLeaderboardQuery = useReferrerQuery(networkId, undefined, {
        enabled: !!walletAddress && isAppReady,
    });

    const affiliateCompetitionData = useMemo(() => {
        if (affiliateLeaderboardQuery?.data) {
            return orderBy(affiliateLeaderboardQuery.data, ['totalVolume'], ['desc']);
        }
        return [];
    }, [affiliateLeaderboardQuery?.isSuccess]);

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

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast(t('referral-page.modal.copied'));
    };

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
        } else if (landingPage == 1) {
            setReferralLink(
                `${window.location.origin}${buildReferralLink(ROUTES.Options.RangeMarkets, walletAddress)}`
            );
        } else if (landingPage == 2) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Home, walletAddress)}`);
        } else if (landingPage == 3) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Options.Token, walletAddress)}`);
        } else if (landingPage == 4) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Options.Royal, walletAddress)}`);
        } else if (landingPage == 5) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Options.Game, walletAddress)}`);
        } else if (landingPage == 6) {
            setReferralLink(`${window.location.origin}${buildReferralLink(ROUTES.Governance.Home, walletAddress)}`);
        }
    };

    const handleReadMore = () => {
        if (!showMore) setHeight('470px');
        if (showMore) setHeight('170px');
        setShowMore(!showMore);
    };

    return (
        <>
            <HeaderContainer>
                <FormWrapper>
                    <Label>{t('referral-page.choose-landing')}</Label>
                    <RowContrainer>
                        <SelectInput
                            options={landingPageOptions}
                            handleChange={(value) => setLandingPage(Number(value))}
                            defaultValue={0}
                        />
                    </RowContrainer>
                    {/* <Label>{t('referral-page.form-label')}</Label> */}
                    <Button
                        padding={'5px 0px'}
                        margin={'9px 0px 9px 0'}
                        active={true}
                        hoverShadow={'var(--button-shadow)'}
                        onClickHandler={generateLinkHandler}
                    >
                        {t('referral-page.generate-link-btn')}
                    </Button>
                    <InputWithIcon
                        text={referralLink}
                        onIconClick={() => copyLink()}
                        customIconClass={'icon icon--copy'}
                    />
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
                        <StatLabel>{t('referral-page.statistics.total-fees')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, statisticsData.totalVolume * 0.02, 2)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel color={UI_COLORS.GREEN}>{t('referral-page.statistics.earned')}</StatLabel>
                        <StatValue color={UI_COLORS.GREEN}>
                            {formatCurrencyWithSign(USD_SIGN, statisticsData.totalEarned, 2)}
                        </StatValue>
                    </KeyValue>
                </StatisticsWrapper>
                <DescriptionContainer>
                    <Text height={textHeight}>
                        <Trans
                            i18nKey={'referral-page.description'}
                            components={{ bold: <BoldText />, italic: <i /> }}
                        />
                        <TextGradient />
                    </Text>
                    <ReadMoreButton onClick={handleReadMore} active={showMore} />
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
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 2}
                    onClick={() => setTabIndex(Tabs[2].id)}
                >
                    {t(Tabs[2].i18label)}
                </Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <>
                    {tabIndex == Tabs[0].id && (
                        <TableWrapper>
                            <Table
                                data={transactionData}
                                defaultPage={10}
                                containerStyle={{
                                    width: '100%',
                                    maxWidth: '100%',
                                }}
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
                                        id: 'amount',
                                        Header: <>{t('referral-page.table.earned')}</>,
                                        // accessor: 'amount',
                                        accessor: (row: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, row.amount, 2)}</p>
                                        ),
                                        // Cell: (cellProps: any) => (
                                        //     <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                        // ),
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
                                containerStyle={{
                                    width: '100%',
                                    maxWidth: '100%',
                                }}
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
                    {tabIndex == Tabs[2].id && (
                        <TableWrapper>
                            <Table
                                data={affiliateCompetitionData}
                                defaultPage={10}
                                containerStyle={{
                                    width: '100%',
                                    maxWidth: '100%',
                                }}
                                columns={[
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
                                    {
                                        Header: <>{t('referral-page.table.first-transaction')}</>,
                                        accessor: 'timestamp',
                                        Cell: (cellProps: any) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
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

const BoldText = styled.span`
    font-weight: 900;
    text-decoration: underline;
`;

const TextGradient = styled.div`
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100px; /* adjust it to your needs */
    background: url(data:image/svg+xml;base64,alotofcodehere);
    background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
    background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        color-stop(0%, rgba(255, 255, 255, 0)),
        color-stop(70%, rgba(255, 255, 255, 1))
    );
    background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
    background: -o-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
    background: -ms-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%);
`;

export default Referral;
