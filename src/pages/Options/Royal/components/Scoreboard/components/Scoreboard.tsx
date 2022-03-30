import DiscordImage from 'assets/images/royale/discord.png';
import notSigned from 'assets/images/royale/not-signed.svg';
import SimpleLoader from 'components/SimpleLoader';
import i18n from 'i18n';
import { DEFAULT_LANGUAGE, SupportedLanguages } from 'i18n/config';
import { ArrowsWrapper } from 'pages/Options/Home/MarketsTable/components';
import { RoyaleTooltip } from 'pages/Options/Market/components';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Image, LoaderContainer, Text } from 'theme/common';
import { getIsOVM } from 'utils/network';
import useRoyaleDataForScoreboard from '../queries/useRoyaleDataForScoreboard';
import useRoyalePlayersQuery, { User, UserStatus } from '../queries/useRoyalePlayersQuery';

const PerPageOption = [15, 25, 50, 100];

type HeadCell = {
    id: number;
    text: any;
    sortable: boolean;
};

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

type ScoreboardProps = {
    selectedSeason: number;
    setSelectedSeason: (season: number) => void;
};

const defaultOrderBy = 1;

export const ScoreboardV2: React.FC<ScoreboardProps> = ({ selectedSeason }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const { t } = useTranslation();
    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.ASC);
    const [showDropdown, setShowDropdown] = useState(false);

    const [showPerPage, setShowPerPage] = useState(15);
    const [searchString, setSearchString] = useState('');
    const royaleDataQuery = useRoyaleDataForScoreboard(selectedSeason, {
        enabled: isL2 && isAppReady,
    });

    const usersQuery = useRoyalePlayersQuery(networkId, selectedSeason, {
        enabled: isL2 && isAppReady,
    });
    const users = usersQuery.isSuccess ? usersQuery.data : [];

    const royaleData = royaleDataQuery.isSuccess ? royaleDataQuery.data : undefined;

    useEffect(() => {
        usersQuery.remove();
        royaleDataQuery.remove();
    }, [selectedSeason]);

    const usersForUi = useMemo(() => {
        if (!royaleData) return;
        if (users.length > 0) {
            let usersToShow: any = users;

            switch (orderBy) {
                case 1:
                    usersToShow = usersToShow.sort((a: any, b: any) => {
                        if (a.isAlive && b.isAlive) {
                            return a.number - b.number;
                        }
                        if (!a.isAlive && !b.isAlive) {
                            if (a.deathRound === b.deathRound) return a.number - b.number;
                            return orderDirection === OrderDirection.ASC
                                ? b.deathRound - a.deathRound
                                : a.deathRound - b.deathRound;
                        }
                        if (orderDirection === OrderDirection.ASC) {
                            return a.isAlive ? -1 : 1;
                        } else {
                            return a.isAlive ? 1 : -1;
                        }
                    });
                    break;
                case 3:
                    usersToShow = usersToShow.sort((a: any, b: any) => {
                        return orderDirection === OrderDirection.ASC
                            ? a.name.localeCompare(b.name)
                            : b.name.localeCompare(a.name);
                    });
                    break;

                case 4:
                    usersToShow = usersToShow.sort((a: any, b: any) => {
                        return orderDirection === OrderDirection.ASC ? a.number - b.number : b.number - a.number;
                    });
                    break;
            }
            if (searchString !== '') {
                usersToShow = usersToShow.filter((user: any) => {
                    return (
                        user.name.toLowerCase().includes(searchString.toLowerCase()) ||
                        user.number.toString().toLowerCase().includes(searchString.toLowerCase())
                    );
                });
            }
            const maxPages =
                Math.ceil(usersToShow.length / showPerPage) < 1 ? 1 : Math.ceil(usersToShow.length / showPerPage);
            // set page number to 1 in case number of players in search result < usersToShow
            const usersToDisplay =
                usersToShow.length < showPerPage
                    ? usersToShow
                    : usersToShow.slice((page - 1) * showPerPage, showPerPage * page);

            Math.ceil(usersToShow.length / showPerPage) < 1 || usersToShow.length < showPerPage ? setPage(1) : '';

            return { maxPages, usersToDisplay };
        }
    }, [page, orderBy, orderDirection, users, showPerPage, searchString, royaleData, selectedSeason]);

    const HeadCells: HeadCell[] = [
        { id: 1, text: <Trans i18nKey="options.royale.scoreboard.table-header.status" />, sortable: true },
        { id: 2, text: <Trans i18nKey="options.royale.scoreboard.table-header.avatar" />, sortable: false },
        { id: 3, text: <Trans i18nKey="options.royale.scoreboard.table-header.name" />, sortable: true },
        {
            id: 4,
            text: (
                <Trans
                    i18nKey="options.royale.scoreboard.table-header.number"
                    components={{ sans: <span style={{ fontFamily: 'sans-serif !important' }} /> }}
                />
            ),
            sortable: true,
        },
    ];
    const calcDirection = (cell: HeadCell) => {
        if (orderBy === cell.id) {
            switch (orderDirection) {
                case OrderDirection.NONE:
                    setOrderDirection(OrderDirection.ASC);
                    break;
                case OrderDirection.ASC:
                    setOrderDirection(OrderDirection.DESC);
                    break;
                case OrderDirection.DESC:
                    setOrderDirection(OrderDirection.ASC);
                    setOrderBy(defaultOrderBy);
                    break;
            }
        } else {
            setOrderBy(parseInt(cell.id.toString()));
            setOrderDirection(OrderDirection.ASC);
            setPage(1);
        }
    };

    if (selectedSeason && royaleData) {
        return (
            <TableWrapper>
                <TableRow
                    style={{
                        justifyContent: 'flex-end',
                        position: 'relative',
                        marginTop: window.innerWidth < 768 ? '5%' : '5',
                    }}
                >
                    <SearchWrapper
                        onChange={(e) => setSearchString(e.target.value)}
                        value={searchString}
                        placeholder={t('options.royale.scoreboard.search')}
                    />
                    <SearchIcon className="icon icon--search" />
                </TableRow>

                <TableRow>
                    {HeadCells.map((cell, key) => (
                        <HeadCellUi
                            style={{ cursor: cell.sortable ? 'pointer' : 'arrow' }}
                            onClick={cell.sortable ? calcDirection.bind(this, cell) : () => {}}
                            key={key}
                        >
                            {cell.text}{' '}
                            {cell.sortable && (
                                <ArrowsWrapper>
                                    {orderBy === cell.id && orderDirection !== OrderDirection.NONE ? (
                                        <Arrow
                                            className={`icon ${
                                                orderDirection === OrderDirection.DESC
                                                    ? 'icon--arrow-down'
                                                    : 'icon--arrow-up'
                                            }`}
                                        />
                                    ) : (
                                        <>
                                            <Arrow className="icon icon--double-arrow" />
                                        </>
                                    )}
                                </ArrowsWrapper>
                            )}
                        </HeadCellUi>
                    ))}
                </TableRow>
                {!royaleData?.seasonStarted ? (
                    <NoUsers>
                        <i className="icon icon--clock" style={{ paddingRight: 10 }}></i>{' '}
                        {t('options.royale.scoreboard.season-not-started')}
                    </NoUsers>
                ) : royaleData?.seasonStarted && users.length <= 0 ? (
                    <NoUsers>{t('options.royale.scoreboard.no-users')}</NoUsers>
                ) : usersForUi ? (
                    usersForUi.usersToDisplay.map((user: User, key: number) => {
                        const lastRoundInSeason = royaleData?.round;

                        const isUserAWinner =
                            (user.isAlive && royaleData?.seasonFinished) ||
                            (Number(user.deathRound) === Number(lastRoundInSeason) && royaleData?.seasonFinished);

                        return (
                            <TableRow
                                key={key}
                                className={user.isAlive || isUserAWinner ? 'alive' : 'dead'}
                                style={{ marginBottom: 12, opacity: user.status === UserStatus.RDY ? 1 : 0.5 }}
                            >
                                <HeadCellUi winner={isUserAWinner}>
                                    <Status>
                                        <StatusAvatar
                                            winner={isUserAWinner}
                                            className={
                                                user.isAlive || isUserAWinner ? 'icon icon--alive' : 'icon icon--dead'
                                            }
                                        />
                                        <span>
                                            {user.isAlive || isUserAWinner
                                                ? royaleData?.seasonFinished
                                                    ? t('options.royale.scoreboard.winner')
                                                    : t('options.royale.scoreboard.alive')
                                                : t('options.royale.scoreboard.dead')}
                                        </span>
                                        <span>
                                            {!user.isAlive
                                                ? t('options.royale.footer.rd') + ': ' + user.deathRound
                                                : ''}
                                        </span>
                                    </Status>
                                </HeadCellUi>
                                <HeadCellUi winner={isUserAWinner}>{getAvatar(user, royaleData)}</HeadCellUi>
                                <HeadCellUi
                                    winner={isUserAWinner}
                                    style={{
                                        marginRight: 6,
                                        textDecoration: '',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {user.name}
                                </HeadCellUi>
                                <HeadCellUi winner={isUserAWinner} style={{ marginLeft: 6 }}>
                                    #{user.number}
                                </HeadCellUi>
                            </TableRow>
                        );
                    })
                ) : (
                    <LoaderContainer style={{ top: 'calc(50% + 30px)' }}>
                        <SimpleLoader />
                    </LoaderContainer>
                )}

                {usersForUi?.usersToDisplay ? (
                    <Pagination>
                        <PaginationIcon
                            className={`icon icon--double-left ${page <= 1 ? 'disabled' : ''}`}
                            onClick={() => {
                                if (page <= 1) return;
                                setPage(1);
                            }}
                        />
                        <PaginationIcon
                            className={`icon icon--left ${page <= 1 ? 'disabled' : ''}`}
                            onClick={() => {
                                if (page <= 1) return;
                                setPage(page - 1);
                            }}
                        />
                        <Text className="max-pages">
                            {page}/{usersForUi?.maxPages}
                        </Text>
                        <PaginationIcon
                            className={`icon icon--right ${
                                usersForUi && usersForUi.maxPages === page ? 'disabled' : ''
                            }`}
                            onClick={() => {
                                if (usersForUi && usersForUi.maxPages === page) return;
                                setPage(page + 1);
                            }}
                        />
                        <PaginationIcon
                            className={`icon icon--double-right ${
                                usersForUi && usersForUi.maxPages === page ? 'disabled' : ''
                            }`}
                            onClick={() => {
                                if (usersForUi && usersForUi.maxPages === page) return;
                                setPage(usersForUi.maxPages);
                            }}
                        />

                        <PaginationUsers>
                            <Text onClick={setShowDropdown.bind(this, true)}>{showPerPage}</Text>
                            {showDropdown &&
                                PerPageOption.filter((number) => number !== showPerPage).map(
                                    (option: number, key: number) => (
                                        <Text
                                            onClick={() => {
                                                setShowPerPage(option);
                                                setShowDropdown(false);
                                                setPage(1);
                                            }}
                                            key={key}
                                        >
                                            {option}
                                        </Text>
                                    )
                                )}
                        </PaginationUsers>
                        <UsersPerPageText top={selectedLanguage === SupportedLanguages.RUSSIAN ? -3 : 12}>
                            {t('options.royale.scoreboard.users-per-page')}
                        </UsersPerPageText>
                        {showDropdown && <Overlay onClick={() => setShowDropdown(false)} />}
                    </Pagination>
                ) : (
                    ''
                )}
            </TableWrapper>
        );
    } else {
        return (
            <TableWrapper>
                <LoaderContainer style={{ top: 'calc(50% + 30px)', left: '50%' }}>
                    <SimpleLoader />
                </LoaderContainer>
            </TableWrapper>
        );
    }
};

const getAvatar = (user: User, royaleData: any) => {
    if (user.status === UserStatus.RDY) {
        const lastRoundInSeason = royaleData.round;
        const fallbackAvatar = user.number % 10;
        const isUserAWinner =
            (user.isAlive && royaleData.seasonFinished) ||
            (Number(user.deathRound) === lastRoundInSeason && royaleData.seasonFinished);
        if (user.avatar) {
            return <UserAvatar winner={isUserAWinner} src={user.avatar || DiscordImage} />;
        } else {
            return (
                <RoyaleAvatar
                    winner={isUserAWinner}
                    className={`royale-avatar royale-avatar--${fallbackAvatar}`}
                ></RoyaleAvatar>
            );
        }
    }

    return (
        <RoyaleTooltip title="User is not registered for Thales Royale">
            <UserAvatar src={notSigned} />
        </RoyaleTooltip>
    );
};

const SearchWrapper = styled.input`
    max-width: 275px;
    height: 28px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 78.34%;
    letter-spacing: -0.4px;
    background: var(--color-wrapper);
    color: var(--coior);
    outline: none !important;
    &::placeholder {
        color: var(--coior);
    }
`;

const SearchIcon = styled.i`
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 17px;
    line-height: 20px;
    min-width: 17px !important;
`;

const PaginationIcon = styled.i`
    font-size: 28px;
    line-height: 24px;
    cursor: pointer;
    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Arrow = styled.i`
    font-size: 12px;
    line-height: 8px;
    display: block;
`;

const UsersPerPageText = styled.p<{ top: number }>`
    position: absolute;
    right: 13px;
    top: ${(props) => props.top}px;
    width: 86px;
    text-align: center;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 13px;
    letter-spacing: -0.4px;
    color: var(--color);
    background: var(--color-wrapper);
    z-index: 6;
`;

const PaginationUsers = styled.div`
    position: absolute;
    right: 6px;
    top: 20px;
    width: 100px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 18px;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    text-align: center;
    background: var(--color-wrapper);
    z-index: 5;
    p:first-child {
        font-weight: bold;
        font-size: 20px;
    }
`;

const Pagination = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .max-pages {
        font-family: Sansation !important;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 330%;
        text-align: center;
        letter-spacing: -0.4px;
        color: var(--color);
        margin: 0 10px;
    }

    @media (max-width: 1024px) {
        justify-content: flex-start;
        margin-left: 10px;
    }
`;

const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

const RoyaleAvatar = styled.i<{ winner?: boolean }>`
    border-radius: 50%50%;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        font-size: 40px;
    }
`;

const StatusAvatar = styled.i<{ winner?: boolean }>`
    color: ${(props) => (props.winner ? '#FFE489' : 'var(--color)')};
    font-size: 35px;
    @media (max-width: 1024px) {
        font-size: 30px;
    }
`;

const Status = styled.span`
    cursor: default;
    span {
        font-family: Sansation !important;
        display: none;
        text-transform: lowercase;
        font-size: 20px;
    }
    &:hover {
        i {
            display: none;
        }
        span {
            display: block;
        }
    }
`;

const NoUsers = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 23px;
    line-height: 126px;
    color: var(--color);
    text-shadow: 0px 0px 30px var(--color);
    text-align: center;
`;

const TableWrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 300px;
    background: var(--color-wrapper);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    padding: 30px;
    @media (max-width: 1024px) {
        padding: 5px;
    }
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: var(--color);
    &.dead {
        text-decoration: line-through;
    }
    & > * {
        text-align: center;
        margin: 0 !important;
        min-width: 88px;
        &:first-child {
            flex: 1;
        }
        &:nth-child(2) {
            flex: 1;
        }
        &:nth-child(3) {
            flex: 2;
        }
        &:last-child {
            flex: 1;
        }
        @media (max-width: 1024px) {
            min-width: 67px;
        }
    }
`;

const HeadCellUi = styled(Text)<{ winner?: boolean }>`
    cursor: pointer;
    white-space: pre;
    font-family: Sansation !important;
    font-size: 20px;
    color: ${(props) => (props.winner ? '#FFE489' : 'var(--color)')};
    @media (max-width: 1024px) {
        font-size: 15px;
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
`;

export default ScoreboardV2;
