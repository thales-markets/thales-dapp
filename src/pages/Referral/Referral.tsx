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
import Tooltip from 'components/Tooltip';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import OpRewardsBanner from 'components/OpRewardsBanner';
import { getIsOVM } from 'utils/network';
import Footer from 'components/Footer';
import ElectionsBanner from 'components/ElectionsBanner';
import OutsideClickHandler from 'react-outside-click-handler';

const tabs = [
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

    const showOPBanner = getIsOVM(networkId);

    const [tabIndex, setTabIndex] = useState(tabs[0].id);
    const [landingPage, setLandingPage] = useState<number | undefined>(0);
    const [referralLink, setReferralLink] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [textHeight, setHeight] = useState('170px');
    const [showViewsDropdown, setShowViewsDropdown] = useState(false);
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
        enabled: isAppReady,
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
        if (!showMore) setHeight('370px');
        if (showMore) setHeight('170px');
        setShowMore(!showMore);
    };

    return (
        <>
            {showOPBanner && <OpRewardsBanner />}
            <ElectionsBanner />
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
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, statisticsData.totalVolume)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel>{t('referral-page.statistics.total-fees')}</StatLabel>
                        <StatValue>{formatCurrencyWithSign(USD_SIGN, statisticsData.totalVolume * 0.02)}</StatValue>
                    </KeyValue>
                    <KeyValue>
                        <StatLabel color={UI_COLORS.GREEN}>{t('referral-page.statistics.earned')}</StatLabel>
                        <StatValue color={UI_COLORS.GREEN}>
                            {formatCurrencyWithSign(USD_SIGN, statisticsData.totalEarned)}
                        </StatValue>
                    </KeyValue>
                </StatisticsWrapper>
                <DescriptionContainer>
                    <Text height={textHeight}>
                        <Trans
                            i18nKey={'referral-page.description'}
                            components={{ bold: <BoldText />, italic: <i /> }}
                        />
                        {/* <TextGradient /> */}
                    </Text>
                    <ReadMoreButton onClick={handleReadMore} active={showMore} />
                </DescriptionContainer>
            </HeaderContainer>
            <ViewButton onClick={() => setShowViewsDropdown(!showViewsDropdown)}>
                {t('referral-page.tabs.current-view', { currentView: t(tabs[tabIndex].i18label) })}
            </ViewButton>
            {showViewsDropdown && (
                <ViewsDropDownWrapper>
                    <ViewsDropDown>
                        <OutsideClickHandler onOutsideClick={() => setShowViewsDropdown(false)}>
                            <ViewTitle>{t('referral-page.tabs.view')}</ViewTitle>
                            {tabs.map((item, index) => {
                                return (
                                    <ViewItem
                                        active={tabIndex === item.id}
                                        key={index}
                                        onClick={() => {
                                            setTabIndex(item.id);
                                            setShowViewsDropdown(false);
                                        }}
                                    >
                                        {t(item.i18label)}
                                    </ViewItem>
                                );
                            })}
                        </OutsideClickHandler>
                    </ViewsDropDown>
                </ViewsDropDownWrapper>
            )}
            <Container.Main justifyContent="flex-start" hide={false}>
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 0}
                    onClick={() => setTabIndex(tabs[0].id)}
                >
                    {t(tabs[0].i18label)}
                </Container.Main.Item>
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 1}
                    onClick={() => setTabIndex(tabs[1].id)}
                >
                    {t(tabs[1].i18label)}
                </Container.Main.Item>
                <Container.Main.Item
                    noStrech={true}
                    padding={'20px 30px'}
                    active={tabIndex == 2}
                    onClick={() => setTabIndex(tabs[2].id)}
                >
                    {t(tabs[2].i18label)}
                </Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <>
                    {tabIndex == tabs[0].id && (
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
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('volume'),
                                    },
                                    {
                                        Header: <>{t('referral-page.table.earned')}</>,
                                        accessor: 'amount',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('amount'),
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
                    {tabIndex == tabs[1].id && (
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
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('totalVolume'),
                                    },
                                    {
                                        Header: <>{t('referral-page.table.total-earned')}</>,
                                        accessor: 'totalEarned',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('totalEarned'),
                                    },
                                ]}
                            />
                        </TableWrapper>
                    )}
                    {tabIndex == tabs[2].id && (
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
                                        sortType: customColumnSort('trades'),
                                    },
                                    {
                                        Header: <>{t('referral-page.table.total-volume')}</>,
                                        accessor: 'totalVolume',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('totalVolume'),
                                    },
                                    {
                                        Header: <>{t('referral-page.table.total-earned')}</>,
                                        accessor: 'totalEarned',
                                        Cell: (cellProps: any) => (
                                            <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                        ),
                                        sortable: true,
                                        sortType: customColumnSort('totalEarned'),
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
            <ReferralFooter>
                {t('referral-page.footer.sharing')}
                <Tooltip
                    message={t('referral-page.disclaimer')}
                    type={'info'}
                    iconColor={'var(--primary-color)'}
                    container={{ width: '15px' }}
                    interactive={true}
                />
                {t('referral-page.footer.and')}{' '}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={termsOfUse}
                    style={{ color: 'var(--primary-color)', marginLeft: '5px', textDecoration: 'underline' }}
                >
                    {' '}
                    {t('referral-page.footer.terms')}
                </a>
            </ReferralFooter>
            <Footer />
        </>
    );
};

const BoldText = styled.span`
    font-weight: 900;
`;

const ReferralFooter = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    font-size: 16px;
    color: var(--primary-color);
    @media screen and (max-width: 520px) {
        margin-top: 50px;
        margin-bottom: 10px;
        display: inline-block;
        div {
            display: inline;
        }
    }
`;

const customColumnSort = (propertyName: string) => (rowA: any, rowB: any, desc: boolean) => {
    if (desc) {
        return +rowA.original[propertyName] > +rowB.original[propertyName] ? 1 : -1;
    } else {
        return +rowA.original[propertyName] < +rowB.original[propertyName] ? 1 : -1;
    }
};

const ViewButton = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: block;
        align-self: center;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 6px 20px;
        border: 1.5px solid rgba(100, 217, 254, 0.5);
        box-sizing: border-box;
        border-radius: 30px;
        background: transparent;
        font-family: Roboto !important;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: #64d9fe;
    }
`;

const ViewsDropDownWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

const ViewsDropDown = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
        border: 2px solid rgba(100, 217, 254, 0.5);
        box-sizing: border-box;
        border-radius: 12px;
        padding: 15px 20px;
        max-width: 240px;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        top: -56px;
        z-index: 2;
    }
`;

const ViewTitle = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: #64d9fe;
    @media (min-width: 769px) {
        display: none;
    }
    margin-bottom: 10px;
`;

const ViewItem = styled.div<{ active: boolean }>`
    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
        text-transform: uppercase;
        cursor: pointer;
        font-family: Roboto !important;
        font-style: normal;
        color: ${(_props) => (_props?.active ? '#64d9fe' : '#ffffff')};
    }
`;

export default Referral;
