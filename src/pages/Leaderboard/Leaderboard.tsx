import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';

import useLeaderboardQuery from 'queries/leaderboard/useLeaderboardQuery';
import { Trans, useTranslation } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';

import { FlexDivSpaceBetween } from 'theme/common';
import { UI_COLORS } from 'constants/ui';
import { orderBy } from 'lodash';
import SearchField from 'components/TableInputs/SearchField';
import UserInfoTradingCompetition from './components/UserInfoTradingCompetition';
import Tooltip from 'components/Tooltip';
import Container, {
    CustomTableHeader,
    FormContainer,
    Gain,
    IconHolder,
    MobileButtonsContainer,
    TradingCompText,
    UserAvatar,
    Wrapper,
    WrapperForText,
} from './styled-components';
import { buildHref, navigateTo } from '../../utils/routes';
import ROUTES from '../../constants/routes';
import MobileDropdownMenu from 'components/MobileDropdownMenu';
import { LightTooltip } from 'components/OldVersion/old-components';
import { ReactComponent as AssetIcon } from 'assets/images/asset.svg';

type Competition = 'byNetProfit' | 'percetangeGain';

const CompetitionTabs = [
    {
        type: 'byNetProfit',
        i18Label: 'options.leaderboard.trading-competition.net-profit-competition',
    },
    {
        type: 'percetangeGain',
        i18Label: 'options.leaderboard.trading-competition.percentage-profit-competition',
    },
];

const Leaderboard: React.FC = () => {
    const { t } = useTranslation();
    const [competitionType, setCompetitionType] = useState<Competition>('byNetProfit');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const query = useLeaderboardQuery(networkId, { enabled: isAppReady });

    const data = useMemo(() => {
        if (query.isSuccess) {
            let users = query?.data?.length ? query.data : [];

            if (competitionType == 'byNetProfit') {
                users = orderBy(users, ['profit'], ['desc']);
            }

            if (competitionType == 'percetangeGain') {
                users = orderBy(users, ['gain'], ['desc']);
            }

            let stickyUser = null;

            users.forEach((user, index) => {
                user['rank'] = index + 1;
                if (walletAddress && user.walletAddress.toLowerCase() === walletAddress?.toLowerCase()) {
                    stickyUser = JSON.parse(JSON.stringify(user));
                    stickyUser['sticky'] = true;
                    stickyUser['name'] = 'Your current rank';
                }
            });

            if (searchQuery !== '') {
                users = users.filter((user) => {
                    return (
                        user?.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                });
            }

            if (stickyUser) users.push(stickyUser);

            return users;
        }

        return [];
    }, [query.isSuccess, competitionType, searchQuery]);

    const customLeaderboardSort = useMemo(
        () => (rowA: any, rowB: any, columnId: string, desc: boolean) => {
            if (desc) {
                return rowA.values[columnId] - rowB.values[columnId];
            } else {
                return rowA.values[columnId] - rowB.values[columnId];
            }
        },
        [walletAddress]
    );

    const handleResize = () => {
        if (window.innerWidth <= 9 * 150 * 0.9) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <Wrapper>
                <FlexDivSpaceBetween style={{ gap: 20 }}>
                    <WrapperForText>
                        <TradingCompText>{t('options.leaderboard.trading-comp-subtitle')}</TradingCompText>
                        <TradingCompText>{t('options.leaderboard.trading-comp-subtitle-2')}</TradingCompText>
                        <TradingCompText>
                            <Trans
                                i18nKey="options.leaderboard.trading-comp-subtitle-3"
                                components={{
                                    bold: (
                                        <strong
                                            onClick={() => {
                                                navigateTo(buildHref(ROUTES.Options.Home));
                                            }}
                                        />
                                    ),
                                }}
                            />
                        </TradingCompText>
                        <TradingCompText>
                            <Trans
                                i18nKey="options.leaderboard.trading-comp-subtitle-4"
                                components={{
                                    link1: (
                                        <a
                                            href="https://thalesmarket.medium.com/thales-goes-to-polygon-and-celebrates-with-a-trading-competition-634449d7f23d"
                                            rel="noreferrer"
                                            target="_blank"
                                        />
                                    ),
                                    link2: (
                                        <a
                                            href="https://docs.thalesmarket.io/competitions-and-events/thales-polygon-trading-competition"
                                            rel="noreferrer"
                                            target="_blank"
                                        />
                                    ),
                                }}
                            />
                        </TradingCompText>
                        <TradingCompText>
                            <Trans
                                i18nKey="options.leaderboard.trading-comp-subtitle-5"
                                components={{
                                    bold: (
                                        <a
                                            href="https://docs.thalesmarket.io/using-thales/thales-amm"
                                            rel="noreferrer"
                                            target="_blank"
                                        />
                                    ),
                                }}
                            />
                        </TradingCompText>
                        <TradingCompText>{t('options.leaderboard.trading-comp-subtitle-6')}</TradingCompText>
                    </WrapperForText>
                    <UserInfoTradingCompetition></UserInfoTradingCompetition>
                </FlexDivSpaceBetween>

                {isMobile && (
                    <MobileButtonsContainer>
                        <MobileDropdownMenu
                            buttonTitle={'Filters'}
                            dropdownTitle={'Filters'}
                            items={[
                                {
                                    active: CompetitionTabs[0].type == competitionType,
                                    onClick: () => setCompetitionType(CompetitionTabs[0].type as Competition),
                                    title: t(CompetitionTabs[0].i18Label),
                                },
                                {
                                    active: CompetitionTabs[1].type == competitionType,
                                    onClick: () => setCompetitionType(CompetitionTabs[1].type as Competition),
                                    title: t(CompetitionTabs[1].i18Label),
                                },
                            ]}
                        />
                    </MobileButtonsContainer>
                )}
                <Container.Main justifyContent="flex-start" hide={isMobile}>
                    <Container.Main.Item
                        noStrech={true}
                        padding={'20px 30px'}
                        active={CompetitionTabs[0].type == competitionType}
                        onClick={() => setCompetitionType(CompetitionTabs[0].type as Competition)}
                    >
                        {t(CompetitionTabs[0].i18Label)}
                    </Container.Main.Item>
                    <Container.Main.Item
                        noStrech={true}
                        padding={'20px 30px'}
                        active={CompetitionTabs[1].type == competitionType}
                        onClick={() => setCompetitionType(CompetitionTabs[1].type as Competition)}
                    >
                        {t(CompetitionTabs[1].i18Label)}
                    </Container.Main.Item>
                    <FormContainer>
                        <SearchField text={searchQuery} handleChange={(value) => setSearchQuery(value)} />
                    </FormContainer>
                </Container.Main>
                <Container.Tab>
                    <Table
                        data={data}
                        columns={[
                            {
                                Header: t('options.leaderboard.table.rank-col'),
                                accessor: 'rank',
                                Cell: (cellProps: any) => (
                                    <IconHolder>
                                        <Position position={cellProps?.cell?.value} />
                                    </IconHolder>
                                ),
                                disableSortBy: true,
                            },
                            {
                                Header: t('options.leaderboard.table.rewards-col'),
                                accessor: 'rewards',
                                Cell: (cellProps: any) => {
                                    if (Number(cellProps?.cell?.row.original.rank) < 51) {
                                        return (
                                            <IconHolder>
                                                <TooltipAssetIcon
                                                    title={getRewardsTooltipMessage(
                                                        cellProps?.cell?.row.original.rank,
                                                        competitionType
                                                    )}
                                                    styleProps={{ width: 40, height: 40 }}
                                                ></TooltipAssetIcon>
                                            </IconHolder>
                                        );
                                    } else {
                                        return <IconHolder>NGMI</IconHolder>;
                                    }
                                },
                                disableSortBy: true,
                            },
                            {
                                Header: t('options.leaderboard.avatar'),
                                accessor: 'avatar',
                                Cell: (cellProps: any) => {
                                    return (
                                        <a
                                            href={
                                                'https://polygonscan.com/address/' +
                                                cellProps.cell.row.original.walletAddress
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <UserAvatar src={cellProps.cell.value} />
                                        </a>
                                    );
                                },
                                disableSortBy: true,
                            },
                            {
                                Header: t('options.leaderboard.display-name'),
                                accessor: 'name',
                                Cell: (cellProps: any) => {
                                    return (
                                        <a
                                            href={
                                                'https://polygonscan.com/address/' +
                                                cellProps.cell.row.original.walletAddress
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <p style={{ color: 'var(--color-white)' }}>{cellProps.cell.value}</p>
                                        </a>
                                    );
                                },
                                disableSortBy: true,
                            },
                            {
                                Header: () => {
                                    return (
                                        <CustomTableHeader>
                                            <Tooltip
                                                message={t('options.leaderboard.table.netprofit-col-tooltip')}
                                                type={'info'}
                                                iconColor={'var(--color-white)'}
                                                container={{ width: '15px' }}
                                                interactive={true}
                                            />
                                            {t('options.leaderboard.table.netprofit-col')}
                                        </CustomTableHeader>
                                    );
                                },
                                accessor: 'profit',
                                Cell: (cellProps: any) => (
                                    <Gain color={cellProps.cell.value > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}>
                                        {formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}
                                    </Gain>
                                ),
                                sortType: customLeaderboardSort,
                            },
                            {
                                Header: t('options.leaderboard.table.gain-col'),
                                accessor: 'gain',
                                Cell: (cellProps: any) => (
                                    <Gain color={cellProps.cell.value > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}>
                                        {formatPercentage(cellProps.cell.value)}
                                    </Gain>
                                ),
                                sortType: customLeaderboardSort,
                            },
                            {
                                Header: t('options.leaderboard.table.trades-col'),
                                accessor: 'trades',
                                disableSortBy: true,
                            },
                            {
                                Header: t('options.leaderboard.table.volume-col'),
                                accessor: 'volume',
                                Cell: (cellProps: any) => (
                                    <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                ),
                                disableSortBy: true,
                            },
                            {
                                Header: t('options.leaderboard.table.investment-col'),
                                accessor: 'investment',
                                Cell: (cellProps: any) => (
                                    <p>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value, 2)}</p>
                                ),
                                disableSortBy: true,
                            },
                        ]}
                        leaderboardView={true}
                        hasStickyRow={true}
                        resultsPerPage={[10, 20, 50, 100]}
                        defaultPage={50}
                    />
                </Container.Tab>
            </Wrapper>
        </>
    );
};

const Position: React.FC<{ position: number }> = ({ position }) => {
    return (
        <>
            {position == 1 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--first-place"
                />
            )}
            {position == 2 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--second-place"
                />
            )}
            {position == 3 && (
                <i
                    style={{ color: 'var(--input-border-color)', fontSize: '50px' }}
                    className="sidebar-icon icon--third-place"
                />
            )}
            {position > 3 && <span>{position}</span>}
        </>
    );
};

const getRewardsTooltipMessage = (position: number, competitionType: Competition) => {
    if (position == 1) {
        if (competitionType == 'byNetProfit') {
            return '7500 THALES and 2500 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '6000 THALES and 2500 MATIC';
        }
    }
    if (position == 2) {
        if (competitionType == 'byNetProfit') {
            return '4750 THALES and 1250 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '3750 THALES and 1250 MATIC';
        }
    }

    if (position == 3) {
        if (competitionType == 'byNetProfit') {
            return '2500 THALES and 1000 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '2000 THALES and 1000 MATIC';
        }
    }

    if (position == 4) {
        if (competitionType == 'byNetProfit') {
            return '1375 THALES and 625 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '1200 THALES and 500 MATIC';
        }
    }

    if (position >= 5 && position <= 20) {
        if (competitionType == 'byNetProfit') {
            return '350 THALES and 55 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '250 THALES and 50 MATIC';
        }
    }

    if (position >= 21 && position <= 32) {
        if (competitionType == 'percetangeGain') {
            return '200 THALES and 50 MATIC';
        }
    }

    if (position > 21 && position <= 50) {
        if (competitionType == 'byNetProfit') {
            return '200 THALES and 50 MATIC';
        }
        if (competitionType == 'percetangeGain') {
            return '162.5 THALES and 37.5 MATIC';
        }
    }

    return '';
};

const TooltipAssetIcon: React.FC<any> = ({ title, styleProps }) => (
    <LightTooltip title={<span className="text-xxxs">{title}</span>}>
        <AssetIcon
            style={{
                border: '1px solid  var(--color-primary)',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: 1,
                ...styleProps,
            }}
            width="12"
            height="12"
            className="tooltip-icon"
        />
    </LightTooltip>
);

export default Leaderboard;
