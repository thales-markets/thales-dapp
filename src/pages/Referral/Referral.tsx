import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
    MenuContainer,
    MenuItem,
    Tab,
    BoldText,
    ViewsDropDownWrapper,
    ViewButton,
    ViewsDropDown,
    ViewTitle,
    ViewItem,
    ReferralFooter,
    StyledLink,
    FooterLink,
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
import useReferralTransactionsQuery, { ReferralTransactions } from 'queries/referral/useReferralTransactionsQuery';
import useReferredTradersQuery, { ReferredTrader } from 'queries/referral/useReferredTradersQuery';
import { buildReferrerLink } from 'utils/routes';
import ROUTES from 'constants/routes';
import useReferrerQuery from 'queries/referral/useReferrerQuery';
import { orderBy } from 'lodash';
import SelectInput from 'components/SelectInput';
import { toast } from 'react-toastify';
import ReadMoreButton from 'components/ReadMoreButton';
import Tooltip from 'components/Tooltip';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import OpRewardsBanner from 'components/OpRewardsBanner';
import { getIsOVM } from 'utils/network';
import Footer from 'components/Footer';
import ElectionsBanner from 'components/ElectionsBanner';
import OutsideClickHandler from 'react-outside-click-handler';
import useGetReffererIdQuery from 'queries/referral/useGetReffererIdQuery';
import { generalConfig } from 'config/general';
import axios from 'axios';
import snxJSConnector from 'utils/snxJSConnector';
import TextInput from 'components/fields/TextInput/TextInput';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

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
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const showOPBanner = getIsOVM(networkId);

    const [tabIndex, setTabIndex] = useState(tabs[0].id);
    const [landingPage, setLandingPage] = useState<number>(0);
    const [referralLink, setReferralLink] = useState('');
    const [reffererID, setReffererID] = useState('');
    const [savedReffererID, setSavedReffererID] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [textHeight, setHeight] = useState('150px');
    const [showViewsDropdown, setShowViewsDropdown] = useState(false);

    const reffererIDQuery = useGetReffererIdQuery(walletAddress || '', { enabled: !!walletAddress });

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
        toast(t('referral-page.modal.copied'), { type: 'success' });
    };

    const populateReferralLink = (landingPageId: number, reffererId: string) => {
        let link = ROUTES.Options.Home;
        switch (landingPageId) {
            case 0:
                link = ROUTES.Options.Home;
                break;
            case 1:
                link = ROUTES.Options.RangeMarkets;
                break;
            case 2:
                link = ROUTES.Home;
                break;
            default:
                link = ROUTES.Options.Home;
        }
        setReferralLink(`${window.location.origin}${buildReferrerLink(link, reffererId)}`);
    };

    const generateLinkHandler = useCallback(async () => {
        if (!walletAddress) {
            alert('Connect your wallet first.');
            return;
        }

        const signature = await (snxJSConnector as any).signer.signMessage(reffererID);
        const response = await axios.post(`${generalConfig.API_URL}/update-refferer-id`, {
            walletAddress,
            reffererID,
            signature,
            previousReffererID: savedReffererID,
        });
        if (response.data.error) {
            toast(t('referral-page.generate.id-exists'), { type: 'error' });
        } else {
            populateReferralLink(landingPage, reffererID);
            setSavedReffererID(reffererID);
            toast(t('referral-page.generate.id-create-success'), { type: 'success' });
        }
    }, [reffererID, walletAddress, savedReffererID, t]);

    useEffect(() => {
        if (reffererIDQuery.isSuccess && reffererIDQuery.data) {
            setReffererID(reffererIDQuery.data);
            setSavedReffererID(reffererIDQuery.data);
            populateReferralLink(landingPage, reffererIDQuery.data);
        } else {
            setReffererID('');
            setSavedReffererID('');
            setReferralLink('');
        }
    }, [reffererIDQuery.isSuccess, reffererIDQuery.data]);

    const handleReadMore = () => {
        if (!showMore) setHeight('100%');
        if (showMore) setHeight('150px');
        setShowMore(!showMore);
    };

    const handleLandingPageChange = (value: number | null | undefined) => {
        setLandingPage(Number(value));
        if (savedReffererID) {
            populateReferralLink(Number(value), reffererID);
        }
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
                            handleChange={(value) => handleLandingPageChange(value)}
                            defaultValue={0}
                        />
                    </RowContrainer>
                    <RowContrainer>
                        <TextInput
                            value={reffererID}
                            onChange={(e: any) => setReffererID(e.target.value)}
                            label={t('referral-page.choose-referral')}
                            placeholder={t('referral-page.choose-referral-placeholder')}
                        />
                    </RowContrainer>
                    <Button
                        disabled={!reffererID || savedReffererID === reffererID}
                        margin={'0px 0px 10px 0px'}
                        fontSize="15px"
                        height="30px"
                        onClick={generateLinkHandler}
                    >
                        {t('referral-page.generate.link-btn')}
                    </Button>
                    <TextInput
                        value={referralLink}
                        onIconClick={copyLink}
                        iconClass={'icon icon--copy'}
                        inputFontSize="13px"
                        inputPadding="5px 30px 5px 10px"
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
                        <StatLabel color={theme.textColor.quaternary}>{t('referral-page.statistics.earned')}</StatLabel>
                        <StatValue color={theme.textColor.quaternary}>
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
            <MenuContainer>
                <MenuItem active={tabIndex == 0} onClick={() => setTabIndex(tabs[0].id)}>
                    {t(tabs[0].i18label)}
                </MenuItem>
                <MenuItem active={tabIndex == 1} onClick={() => setTabIndex(tabs[1].id)}>
                    {t(tabs[1].i18label)}
                </MenuItem>
                <MenuItem active={tabIndex == 2} onClick={() => setTabIndex(tabs[2].id)}>
                    {t(tabs[2].i18label)}
                </MenuItem>
            </MenuContainer>
            <Tab>
                {tabIndex == tabs[0].id && (
                    <TableWrapper>
                        <Table
                            data={transactionData}
                            isLoading={transactionsQuery.isLoading}
                            columns={[
                                {
                                    Header: <>{t('referral-page.table.address')}</>,
                                    accessor: 'trader',
                                    Cell: (cellProps: any) => (
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, cellProps.cell.value)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {truncateAddress(cellProps.cell.value)}
                                        </StyledLink>
                                    ),
                                },
                                {
                                    Header: <>{t('referral-page.table.volume')}</>,
                                    accessor: 'volume',
                                    Cell: (cellProps: any) => (
                                        <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                    ),
                                    sortable: true,
                                },
                                {
                                    Header: <>{t('referral-page.table.earned')}</>,
                                    accessor: 'amount',
                                    Cell: (cellProps: any) => (
                                        <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
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
                            isLoading={tradersQuery.isLoading}
                            columns={[
                                {
                                    id: 'index',
                                    Header: <>{t('referral-page.table.index')}</>,
                                    Cell: (cellProps: any) => {
                                        return <p>{cellProps?.row?.id ? Number(cellProps?.row?.id) + 1 : ''}</p>;
                                    },
                                },
                                {
                                    Header: <>{t('referral-page.table.address')}</>,
                                    accessor: 'id',
                                    Cell: (cellProps: any) => (
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, cellProps.cell.value)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {truncateAddress(cellProps.cell.value)}
                                        </StyledLink>
                                    ),
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
                                },
                                {
                                    Header: <>{t('referral-page.table.total-earned')}</>,
                                    accessor: 'totalEarned',
                                    Cell: (cellProps: any) => (
                                        <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
                                    ),
                                    sortable: true,
                                },
                            ]}
                        />
                    </TableWrapper>
                )}
                {tabIndex == tabs[2].id && (
                    <TableWrapper>
                        <Table
                            data={affiliateCompetitionData}
                            isLoading={affiliateLeaderboardQuery.isLoading}
                            columns={[
                                {
                                    Header: <>{t('referral-page.table.address')}</>,
                                    accessor: 'id',
                                    Cell: (cellProps: any) => (
                                        <StyledLink
                                            href={getEtherscanAddressLink(networkId, cellProps.cell.value)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {truncateAddress(cellProps.cell.value)}
                                        </StyledLink>
                                    ),
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
                                },
                                {
                                    Header: <>{t('referral-page.table.total-earned')}</>,
                                    accessor: 'totalEarned',
                                    Cell: (cellProps: any) => (
                                        <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</p>
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
            </Tab>
            <ReferralFooter>
                {t('referral-page.footer.sharing')}
                <Tooltip overlay={t('referral-page.disclaimer')} iconFontSize={14} />
                &nbsp;
                {t('referral-page.footer.and')}
                &nbsp;
                <FooterLink target="_blank" rel="noreferrer" href={termsOfUse}>
                    {t('referral-page.footer.terms')}
                </FooterLink>
                .
            </ReferralFooter>
            <Footer />
        </>
    );
};

export default Referral;
