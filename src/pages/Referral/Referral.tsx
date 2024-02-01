import { useConnectModal } from '@rainbow-me/rainbowkit';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import axios from 'axios';
import Button from 'components/Button';
import ElectionsBanner from 'components/ElectionsBanner';
import OpRewardsBanner from 'components/OpRewardsBanner';
import ReadMoreButton from 'components/ReadMoreButton';
import SelectInput from 'components/SelectInput';
import Table from 'components/TableV2';
import ToastMessage from 'components/ToastMessage';
import { getErrorToastOptions, getSuccessToastOptions } from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import TextInput from 'components/fields/TextInput/TextInput';
import { generalConfig } from 'config/general';
import { USD_SIGN } from 'constants/currency';
import ROUTES from 'constants/routes';
import { orderBy } from 'lodash';
import useGetReffererIdQuery from 'queries/referral/useGetReffererIdQuery';
import useReferralTransactionsQuery, { ReferralTransactions } from 'queries/referral/useReferralTransactionsQuery';
import useReferredTradersQuery, { ReferredTrader } from 'queries/referral/useReferredTradersQuery';
import useReferrerQuery from 'queries/referral/useReferrerQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { formatCurrencyWithSign, formatTxTimestamp, getEtherscanAddressLink, truncateAddress } from 'thales-utils';
import { ThemeInterface } from 'types/ui';
import { getIsOVM } from 'utils/network';
import { buildReferrerLink } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import {
    BoldText,
    DescriptionContainer,
    FooterLink,
    FormWrapper,
    HeaderContainer,
    KeyValue,
    Label,
    MenuContainer,
    MenuItem,
    ReferralFooter,
    RowContrainer,
    StatLabel,
    StatValue,
    StatisticsWrapper,
    StyledLink,
    Tab,
    TableWrapper,
    Text,
    ViewButton,
    ViewItem,
    ViewTitle,
    ViewsDropDown,
    ViewsDropDownWrapper,
} from './styled-components';

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
    const { openConnectModal } = useConnectModal();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const showOPBanner = getIsOVM(networkId);

    const [tabIndex, setTabIndex] = useState(tabs[0].id);
    const [landingPage, setLandingPage] = useState(0);
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
            label: t('referral-page.pages.speed-market-page'),
        },
        {
            value: 3,
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
            return transactionsQuery.data;
        }

        return [];
    }, [transactionsQuery.isSuccess, transactionsQuery.data, walletAddress]);

    const tradersData: ReferredTrader[] | [] = useMemo(() => {
        if (tradersQuery.isSuccess && tradersQuery.data && walletAddress) {
            return tradersQuery.data;
        }

        return [];
    }, [tradersQuery.isSuccess, tradersQuery.data, walletAddress]);

    const affiliateLeaderboardQuery = useReferrerQuery(networkId, undefined, {
        enabled: isAppReady,
    });

    const affiliateCompetitionData = useMemo(() => {
        if (affiliateLeaderboardQuery?.data) {
            return orderBy(affiliateLeaderboardQuery.data, ['totalVolume'], ['desc']);
        }
        return [];
    }, [affiliateLeaderboardQuery.data]);

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
        toast(
            <ToastMessage id="customId" type="success" message={t('referral-page.modal.copied')} />,
            getSuccessToastOptions('', 'customId')
        );
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
                link = ROUTES.Options.SpeedMarkets;
                break;
            case 3:
                link = ROUTES.Home;
                break;
            default:
                link = ROUTES.Options.Home;
        }
        setReferralLink(`${buildReferrerLink(link, reffererId)}`);
    };

    const generateLinkHandler = useCallback(async () => {
        const signature = await (snxJSConnector as any).signer.signMessage(reffererID);
        const response = await axios.post(`${generalConfig.API_URL}/update-refferer-id`, {
            walletAddress,
            reffererID,
            signature,
            previousReffererID: savedReffererID,
        });
        if (response.data.error) {
            toast(
                <ToastMessage id="customId" type="error" message={t('referral-page.generate.id-exists')} />,
                getErrorToastOptions('', 'customId')
            );
        } else {
            populateReferralLink(landingPage, reffererID);
            setSavedReffererID(reffererID);
            toast(
                <ToastMessage id="customId" type="success" message={t('referral-page.generate.id-create-success')} />,
                getSuccessToastOptions('', 'customId')
            );
        }
    }, [reffererID, walletAddress, savedReffererID, t, landingPage]);

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
    }, [reffererIDQuery.isSuccess, reffererIDQuery.data, landingPage]);

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
                            defaultValue={landingPage}
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
                        disabled={isWalletConnected && (!reffererID || savedReffererID === reffererID)}
                        margin={'0px 0px 10px 0px'}
                        fontSize="15px"
                        height="30px"
                        onClick={isWalletConnected ? generateLinkHandler : openConnectModal}
                    >
                        {walletAddress ? t('referral-page.generate.link-btn') : t('common.wallet.connect-your-wallet')}
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
                            initialState={{
                                sortBy: [
                                    {
                                        id: 'timestamp',
                                        desc: true,
                                    },
                                ],
                            }}
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
        </>
    );
};

export default Referral;
