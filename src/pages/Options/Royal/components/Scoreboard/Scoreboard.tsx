import circle from 'assets/images/royale/circle.svg';
import DiscordImage from 'assets/images/royale/discord.png';
import notSigned from 'assets/images/royale/not-signed.svg';
import triangle from 'assets/images/royale/triangle.svg';
import format from 'date-fns/format';
import { ethers } from 'ethers';
import useInterval from 'hooks/useInterval';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { ArrowsWrapper } from 'pages/Options/Home/MarketsTable/components';
import { OP_KOVAN_SUSD, OP_sUSD } from 'pages/Options/Home/Swap/tokens';
import { RoyaleTooltip } from 'pages/Options/Market/components';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, Image, LoaderContainer, Text } from 'theme/common';
import { erc20Contract } from 'utils/contracts/erc20Contract';
import { truncateAddress } from 'utils/formatters/string';
import { getIsOVM } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import i18n from '../../../../../i18n';
import { DEFAULT_LANGUAGE, SupportedLanguages } from '../../../../../i18n/config';
import { signUp, startRoyale, startRoyaleSeason } from '../../getThalesRoyalData';
import { Positions } from '../../Queries/usePositionsQuery';
import { User, UserStatus } from '../../Queries/useRoyalePlayersQuery';
import { ThalesRoyaleData } from '../../Queries/useThalesRoyaleData';
import { getTimeLeft } from '../BattleRoyale/BattleRoyale';
import SimpleLoader from '../SimpleLoader';
import UserEditRoyaleDataDialog from '../UserEditRoyaleDataDialog/UserEditRoyaleDataDialog';

type ScoreboardProps = {
    ethPrice: string;
    positions: Positions;
    royaleData: ThalesRoyaleData;
    users: User[];
    user: User;
    selectedSeason: any;
    setSelectedSeason: any;
    allSeasons: number[];
    latestSeason: ThalesRoyaleData;
};

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

const defaultOrderBy = 1;

const PerPageOption = [15, 25, 50, 100];

const Scoreboard: React.FC<ScoreboardProps> = ({
    ethPrice,
    positions,
    royaleData,
    users,
    user,
    selectedSeason,
    setSelectedSeason,
    allSeasons,
    latestSeason,
}) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const { t } = useTranslation();
    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.ASC);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);
    const [showPerPage, setShowPerPage] = useState(15);
    const [searchString, setSearchString] = useState('');
    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const isL2 = getIsOVM(networkId);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const buyInToken = isL2 ? (networkId === 10 ? OP_sUSD : OP_KOVAN_SUSD) : '';

    useEffect(() => {
        updateBalanceAndAllowance(buyInToken);
    }, [buyInToken]);

    const handleClosingDialog = () => {
        setOpenEditDialog(false);
    };

    const updateBalanceAndAllowance = (token: any) => {
        if (token) {
            const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, signer);

            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                erc20Instance
                    .allowance(walletAddress, thalesRoyaleContract.address)
                    .then((data: any) =>
                        setAllowance(Number(ethers.utils.formatUnits(data, (token as any).decimals)) > 0)
                    );

                erc20Instance
                    .balanceOf(walletAddress)
                    .then((data: any) => setBalance(ethers.utils.formatUnits(data, (token as any).decimals)));
            }
        }
    };

    const approve = async () => {
        const erc20Instance = new ethers.Contract((buyInToken as any).address, erc20Contract.abi, signer);
        try {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const tx = await erc20Instance.approve(thalesRoyaleContract.address, ethers.constants.MaxUint256);
                await tx.wait();
                setAllowance(true);
            }
        } catch (e) {
            console.log('failed: ', e);
        }
    };

    const usersForUi = useMemo(() => {
        if (!royaleData) return;
        if (users.length > 0) {
            let usersToShow: any =
                royaleData.signUpPeriod < new Date()
                    ? users.filter((user: User) => user.status === UserStatus.RDY)
                    : users;

            switch (orderBy) {
                case 1:
                    usersToShow = usersToShow.sort((a: any, b: any) => {
                        if (a.status !== b.status) {
                            return orderDirection === OrderDirection.ASC ? a.status - b.status : b.status - a.status;
                        } else {
                            if (a.isAlive && b.isAlive) {
                                orderDirection === OrderDirection.ASC ? a.number - b.number : b.number - a.number;
                            } else {
                                return a.isAlive
                                    ? orderDirection === OrderDirection.ASC
                                        ? -1
                                        : 1
                                    : orderDirection === OrderDirection.DESC
                                    ? 1
                                    : -1;
                            }
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

    const getFooter = (user: User | undefined, royaleData: ThalesRoyaleData) => {
        if (!royaleData) return;
        if (latestSeason.season === selectedSeason) {
            if (latestSeason.signUpPeriod > new Date()) {
                if (walletAddress && !user) {
                    if (allowance) {
                        const buyInAmount = latestSeason.buyInAmount;
                        return (
                            <Button disabled={buyInAmount > Number(balance)} onClick={signUp}>
                                {t('options.royale.scoreboard.buy-in', { buyInAmount })}
                            </Button>
                        );
                    } else {
                        return (
                            <Button
                                onClick={async () => {
                                    await approve();
                                    updateBalanceAndAllowance(buyInToken);
                                }}
                            >
                                {t('options.royale.scoreboard.approve-susd')}
                            </Button>
                        );
                    }
                } else if (user) {
                    if (user.status === UserStatus.NOTSIGNED) {
                        if (allowance) {
                            const buyInAmount = latestSeason.buyInAmount;
                            return (
                                <Button disabled={buyInAmount > Number(balance)} onClick={signUp}>
                                    {t('options.royale.scoreboard.buy-in', { buyInAmount })}
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    onClick={async () => {
                                        await approve();
                                        updateBalanceAndAllowance(buyInToken);
                                    }}
                                >
                                    {t('options.royale.scoreboard.approve-susd')}
                                </Button>
                            );
                        }
                    }
                } else {
                    return <Text>Please connect your wallet to compete</Text>;
                }
            } else {
                if (user) {
                    if (user.status === UserStatus.RDY) {
                        if (user.isAlive) {
                            return <></>;
                        } else {
                            return <DeadText>{t('options.royale.scoreboard.eliminated')}</DeadText>;
                        }
                    }
                }
                if (royaleData)
                    if (
                        latestSeason.seasonFinished ||
                        (!latestSeason.seasonStarted && !latestSeason.canStartNewSeason)
                    ) {
                        return (
                            <DeadText>
                                <i className="icon icon--clock" style={{ paddingRight: 10 }}></i>
                                {t('options.royale.scoreboard.season-finished')}
                            </DeadText>
                        );
                    } else {
                        return (
                            <DeadText>
                                <i className="icon icon--clock" style={{ paddingRight: 10 }}></i>
                                {t('options.royale.scoreboard.period-expired')}
                            </DeadText>
                        );
                    }
            }
        }
    };

    return (
        <>
            <OverlayForDropDown
                onClick={() => {
                    if (showDropdown) setShowDropdown(false);
                    if (showSelectDropdown) setShowSelectDropdown(false);
                }}
            ></OverlayForDropDown>
            <UserEditRoyaleDataDialog
                open={openEditDialog}
                handleClose={handleClosingDialog}
                user={user}
                walletAddress={walletAddress}
            ></UserEditRoyaleDataDialog>
            <Wrapper
                onClick={() => {
                    if (showDropdown) setShowDropdown(false);
                    if (showSelectDropdown) setShowSelectDropdown(false);
                }}
                className="scoreboard"
            >
                <div />
                <div style={{ maxWidth: '100%', padding: '5px' }}>
                    <Intro latestSeason={latestSeason} />
                    <UserWrapper>
                        <FlexDiv style={{ alignItems: 'center' }}>
                            {user?.avatar ? (
                                <UserAvatar src={user.avatar} style={{ marginRight: 14 }} />
                            ) : (
                                <i className="icon icon--user-avatar" style={{ fontSize: 44, marginRight: 14 }} />
                            )}

                            <UserLabel>
                                <Trans
                                    i18nKey="options.royale.scoreboard.player-no"
                                    components={{ sans: <span style={{ fontFamily: 'sans-serif !important' }} /> }}
                                />

                                {' #'}
                                {user?.number}
                            </UserLabel>
                        </FlexDiv>
                        <FlexDivColumn style={{ margin: '20px 0' }}>
                            <FlexContainer>
                                <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                                <InputWrapper>
                                    {user?.name}{' '}
                                    <SearchIcon
                                        onClick={setOpenEditDialog.bind(this, true)}
                                        className="icon icon--user-avatar"
                                        style={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            top: '3.5px',
                                            float: 'right',
                                            marginTop: 'auto',
                                            marginBottom: 'auto',
                                            marginRight: '-5px',
                                        }}
                                    />
                                </InputWrapper>
                            </FlexContainer>
                            <FlexContainer>
                                <UserLabel>{t('options.leaderboard.address')}:</UserLabel>
                                <InputWrapper>
                                    {truncateAddress(
                                        walletAddress as any,
                                        truncateAddressNumberOfCharacters,
                                        truncateAddressNumberOfCharacters
                                    )}
                                </InputWrapper>
                            </FlexContainer>
                            <ScoreboardInfoSection style={{ paddingTop: '15px' }}>
                                {selectedSeason === 0 ? (
                                    <div style={{ width: 341, height: 130 }}>
                                        <LoaderContainer style={{ top: 'calc(50%)', left: 'calc(50%)' }}>
                                            <SimpleLoader />
                                        </LoaderContainer>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span>{t('options.royale.footer.up')}</span>
                                            <span>{`${positions.up} ${t('options.royale.footer.vs')} ${
                                                positions.down
                                            }`}</span>
                                            <span>{t('options.royale.footer.down')}</span>
                                        </div>
                                        {!!user?.deathRound && (
                                            <div>
                                                <span>{t('options.royale.footer.you-were-eliminated-in')}</span>
                                                <span>
                                                    {`${t('options.royale.footer.rd')} `}
                                                    {user.deathRound}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <span>
                                                {t('options.royale.footer.current')} ETH{' '}
                                                {t('options.royale.footer.price')}:
                                            </span>
                                            <span>${ethPrice}</span>
                                        </div>
                                        <div>
                                            <span>{t('options.royale.footer.reward-per-player')}:</span>
                                            <span>
                                                {(
                                                    (royaleData?.rewardPerSeason || 1) /
                                                    (royaleData?.roundsInformation[royaleData.roundInASeason - 1]
                                                        ?.totalPlayersPerRoundPerSeason || 1)
                                                ).toFixed(2)}{' '}
                                                sUSD
                                            </span>
                                        </div>
                                        <div>
                                            <span>{t('options.royale.footer.players-alive')}:</span>
                                            <span>
                                                {royaleData?.roundsInformation[royaleData.roundInASeason - 1]
                                                    ?.totalPlayersPerRoundPerSeason
                                                    ? royaleData?.roundsInformation[royaleData.roundInASeason - 1]
                                                          ?.totalPlayersPerRoundPerSeason
                                                    : '0'}
                                                {' / ' + royaleData?.players?.length}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </ScoreboardInfoSection>
                        </FlexDivColumn>
                        {getFooter(user, royaleData)}
                    </UserWrapper>
                    <TableWrapper>
                        <SeasonSelector>
                            {selectedSeason !== 0 ? (
                                <Text onClick={setShowSelectDropdown.bind(this, true)}>
                                    {t('options.royale.scoreboard.season')} {selectedSeason}
                                    {!showSelectDropdown && (
                                        <Arrow
                                            style={{ display: 'inline-block', marginLeft: 20 }}
                                            className="icon icon--arrow-down"
                                        />
                                    )}
                                </Text>
                            ) : (
                                <Text>{t('options.royale.scoreboard.loading-season')}</Text>
                            )}

                            {showSelectDropdown &&
                                allSeasons
                                    .filter((number) => number !== selectedSeason)
                                    .map((option: number, key: number) => (
                                        <Text
                                            onClick={() => {
                                                setSelectedSeason(option);
                                                setShowSelectDropdown(false);
                                            }}
                                            key={key}
                                        >
                                            {t('options.royale.scoreboard.season')} {option}
                                        </Text>
                                    ))}
                        </SeasonSelector>

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
                        {usersForUi ? (
                            usersForUi.usersToDisplay.map((user: User, key: number) => {
                                const lastRoundInSeason = royaleData.roundsInformation.length;
                                const isUserAWinner =
                                    (user.isAlive && royaleData.seasonFinished) ||
                                    (Number(user.deathRound) === lastRoundInSeason && royaleData.seasonFinished);

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
                                                        user.isAlive || isUserAWinner
                                                            ? 'icon icon--alive'
                                                            : 'icon icon--dead'
                                                    }
                                                />
                                                <span>
                                                    {user.isAlive || isUserAWinner
                                                        ? royaleData.seasonFinished
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
                                            {user.name ??
                                                truncateAddress(
                                                    walletAddress as any,
                                                    truncateAddressNumberOfCharacters,
                                                    truncateAddressNumberOfCharacters
                                                )}
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
                            </Pagination>
                        ) : (
                            ''
                        )}
                    </TableWrapper>
                </div>
                <div />
            </Wrapper>
        </>
    );
};

const Intro: React.FC<{ latestSeason: ThalesRoyaleData }> = ({ latestSeason }) => {
    const { t } = useTranslation();
    const [timeLeftForPositioning, setTimeLeftForPositioning] = useState<Date | null>(
        latestSeason ? getTimeLeft(latestSeason.roundInASeasonStartTime, latestSeason.roundChoosingLength) : null
    );
    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const [timeLeftInRound, setTimeLeftInRound] = useState<Date | null>(
        latestSeason
            ? getTimeLeft(
                  latestSeason.roundInASeasonStartTime,
                  (latestSeason.roundInASeasonEndTime.getTime() - latestSeason.roundInASeasonStartTime.getTime()) / 1000
              )
            : null
    );

    const [timeLeftUntilNewSeason, setTimeLeftUntilNewSeason] = useState<Date | null>(
        latestSeason ? getTimeLeft(latestSeason.roundInASeasonStartTime, latestSeason.pauseBetweenSeasonsTime) : null
    );

    const [counter, setCounter] = useState(0);

    useInterval(async () => {
        setCounter(counter + 1);
    }, 1000);

    useInterval(async () => {
        if (!latestSeason) return;
        setTimeLeftForPositioning(getTimeLeft(latestSeason.roundInASeasonStartTime, latestSeason.roundChoosingLength));
        setTimeLeftUntilNewSeason(
            getTimeLeft(latestSeason.roundInASeasonStartTime, latestSeason.pauseBetweenSeasonsTime)
        );
        setTimeLeftInRound(
            getTimeLeft(
                latestSeason.roundInASeasonStartTime,
                (latestSeason.roundInASeasonEndTime.getTime() - latestSeason.roundInASeasonStartTime.getTime()) / 1000
            )
        );
    }, 1000);

    useEffect(() => {
        const round = latestSeason?.roundInASeason;
        timeLeftForPositioning && timeLeftForPositioning?.getHours() === 0
            ? (document.title =
                  format(timeLeftForPositioning, 'mm:ss') +
                  t('options.royale.scoreboard.round-positioning') +
                  t('options.royale.scoreboard.thales-suffix'))
            : timeLeftInRound && timeLeftInRound.getHours() === 0
            ? (document.title =
                  format(timeLeftInRound, 'mm:ss') +
                  t('options.royale.scoreboard.round-ending', { round }) +
                  t('options.royale.scoreboard.thales-suffix'))
            : 'Thales: Binary options trading powered by Synthetix.';
    }, [timeLeftInRound, timeLeftForPositioning]);

    const getTitle = () => {
        if (!latestSeason) return;
        if (latestSeason.seasonFinished || (!latestSeason.seasonStarted && !latestSeason.canStartNewSeason)) {
            if (timeLeftUntilNewSeason) {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.season-ready-in')}</Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftUntilNewSeason
                                ? format(timeLeftUntilNewSeason, 'HH:mm:ss')
                                : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                );
            } else {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.starts')}</Title>
                        <Button
                            onClick={startRoyaleSeason}
                            disabled={!latestSeason.canStartNewSeason}
                            className={!latestSeason.canStartNewSeason ? 'disabled' : ''}
                            style={{
                                margin: '30px auto',
                                fontSize: 30,
                                lineHeight: '30px',
                            }}
                        >
                            <Title style={{ color: 'var(--color-wrapper)' }}>
                                {t('options.royale.scoreboard.start-season')}
                            </Title>
                        </Button>
                    </>
                );
            }
        } else if (!latestSeason.seasonStarted && latestSeason.canStartNewSeason) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.starts')}</Title>
                    <Button
                        onClick={startRoyaleSeason}
                        disabled={!latestSeason.canStartNewSeason}
                        className={!latestSeason.canStartNewSeason ? 'disabled' : ''}
                        style={{
                            margin: '30px auto',
                            fontSize: 30,
                            lineHeight: '30px',
                        }}
                    >
                        <Title style={{ color: 'var(--color-wrapper)' }}>
                            {t('options.royale.scoreboard.start-season')}
                        </Title>
                    </Button>
                </>
            );
        } else if (latestSeason.seasonStarted) {
            if (latestSeason.roundInASeason === 0) {
                {
                    return latestSeason.signUpPeriod < new Date() ? (
                        <>
                            <Title>{t('options.royale.scoreboard.starts')}</Title>
                            <Button
                                onClick={startRoyale}
                                disabled={!latestSeason.canStartRoyale}
                                className={!latestSeason.canStartRoyale ? 'disabled' : ''}
                                style={{
                                    margin: '30px auto',
                                    fontSize: 30,
                                    lineHeight: '30px',
                                }}
                            >
                                <Title style={{ color: 'var(--color-wrapper)' }}>
                                    {t('options.royale.scoreboard.start-royale')}
                                </Title>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Title>{t('options.royale.scoreboard.starts')}</Title>
                            <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                                <TimeRemaining end={latestSeason.signUpPeriod} showFullCounter />
                            </SubTitle>
                        </>
                    );
                }
            } else if (latestSeason.roundInASeason === latestSeason.rounds) {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.ends')}</Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            <TimeRemaining end={latestSeason.roundInASeasonEndTime} showFullCounter />
                        </SubTitle>
                    </>
                );
            } else {
                return timeLeftForPositioning ? (
                    <>
                        <Title>
                            {t('options.royale.scoreboard.position-period')} {latestSeason.roundInASeason}:
                        </Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftForPositioning
                                ? format(timeLeftForPositioning, 'HH:mm:ss')
                                : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                ) : (
                    <>
                        <Title>
                            {t('options.royale.scoreboard.round-period', { round: latestSeason.roundInASeason })}:
                        </Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftInRound ? format(timeLeftInRound, 'HH:mm:ss') : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                );
            }
        }
    };

    return (
        <>
            {getTitle()}
            <Question lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 40 : 30}>
                {t('options.royale.scoreboard.question')}{' '}
            </Question>
            <InfoText style={{ margin: '14px 0px' }}>
                <Trans i18nKey="options.royale.scoreboard.info2" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info3"
                    components={{
                        bold: <strong />,
                        circle: <img src={circle} width="20" height="20" />,
                        triangle: <img src={triangle} width="20" height="20" />,
                    }}
                />
            </InfoText>
            <InfoText style={{ margin: '14px 0px' }}>{t('options.royale.scoreboard.info4')}</InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info5"
                    components={{
                        bold: <strong />,
                    }}
                />
                <Link
                    href="https://thalesmarket.medium.com/thales-royale-a-predictions-game-where-the-winner-s-takes-all-a268f9ec6ec8"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('options.royale.scoreboard.blog')}
                </Link>
            </InfoText>
            <InfoText style={{ marginTop: '8px', textAlign: 'center' }}>
                <Trans
                    i18nKey="options.royale.scoreboard.info6"
                    components={{
                        italic: <i />,
                    }}
                />
            </InfoText>
        </>
    );
};

const getAvatar = (user: User, royaleData: ThalesRoyaleData) => {
    if (user.status === UserStatus.RDY) {
        const lastRoundInSeason = royaleData.roundsInformation.length;
        const isUserAWinner =
            (user.isAlive && royaleData.seasonFinished) ||
            (Number(user.deathRound) === lastRoundInSeason && royaleData.seasonFinished);
        return <UserAvatar winner={isUserAWinner} src={user.avatar || DiscordImage} />;
    }

    return (
        <RoyaleTooltip title="User is not registered for Thales Royale">
            <UserAvatar src={notSigned} />
        </RoyaleTooltip>
    );

    // if (user.status === UserStatus.RDY) {
    //     return <UserAvatar winner={user.isAlive && royaleData.seasonFinished} src={user.avatar || DiscordImage} />;
    // }

    // if (user.status === UserStatus.NOTSIGNED) {
    //     return (
    //         <RoyaleTooltip title="User is not registered for Thales Royale">
    //             <UserAvatar src={notSigned} />
    //         </RoyaleTooltip>
    //     );
    // }
};

const OverlayForDropDown = styled.div`
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`;

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

// const Popup = styled.div`
//     display: flex;
//     position: fixed;
//     top: 300px;
//     width: 420px;
//     left: calc(50% - 200px);
//     margin: auto;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     background: var(--color);
//     border: 5px solid var(--color);
//     box-sizing: border-box;
//     border-radius: 5px;
//     padding: 24px;
//     box-shadow: 0px 4px 50px var(--color);
//     z-index: 1000;
// `;

// const PopupTitle = styled(Text)`
//     font-family: Sansation !important;
//     font-style: normal;
//     font-weight: bold;
//     font-size: 25px;
//     line-height: 28px;
//     color: var(--color-wrapper); ;
// `;

// const PopupImage = styled(Image)`
//     width: 60px;
//     height: 60px;
//     margin: 10px 0;
// `;

// const PopupDescription = styled(Text)`
//     font-family: Sansation !important;
//     font-style: normal;
//     font-weight: normal;
//     font-size: 20px;
//     line-height: 25px;
//     text-align: center;
//     letter-spacing: -0.402542px;
//     color: var(--color-wrapper);
// `;

// const PopupLink = styled.a`
//     font-family: Sansation !important;
//     font-style: normal;
//     font-weight: normal;
//     font-size: 20px;
//     line-height: 22px;
//     letter-spacing: -0.402542px;
//     color: var(--color-wrapper);
//     text-decoration: underline var(--color-wrapper) from-font;
// `;

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
    p:first-child {
        font-weight: bold;
        font-size: 20px;
    }
`;

const SeasonSelector = styled.div`
    position: absolute;
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    top: -17px;
    width: 171px;
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
    z-index: 1;
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

const DeadText = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 23px;
    line-height: 26px;
    color: var(--color);
    text-shadow: 0px 0px 30px var(--color);
    text-align: center;
`;

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 295px;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 14px;
    margin-bottom: 50px;
    @media (max-width: 1024px) {
        padding: 15px;
        height: auto;
    }
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    color: var(--color);
`;

const Button = styled.button`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px var(--color);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    margin: auto;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
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

// const Discord = styled.i`
//     font-size: 24px;
//     line-height: 18px;
//     color: var(--color-wrapper);
//     margin-left: 14px;
// `;

const InputWrapper = styled.div`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const FlexContainer = styled(FlexDivCentered)`
    justify-content: space-between;
    margin: 7px 0;
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

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 570px;
    z-index: 1;
    text-align: center;
    @media (max-width: 1024px) {
        width: 100%;
        padding-bottom: 60px;
    }
`;

const Title = styled(Text)`
    align-self: center;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    padding-bottom: 5px;
    padding-top: 5px;
`;

const SubTitle = styled(Text)<{ lineHeight: number }>`
    margin-top: 4px;
    margin-bottom: 14px;
    align-self: center;
    font-family: basis33 !important;
    font-style: normal;
    font-weight: 400;
    font-size: 80px;
    line-height: ${(props) => props.lineHeight}px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    span {
        font-family: basis33 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 80px;
        line-height: ${(props) => props.lineHeight}px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }
`;

const Question = styled(Text)<{ lineHeight: number }>`
    font-family: basis33 !important;
    font-style: normal;
    font-weight: 400;
    font-size: 38.455px;
    line-height: ${(props) => props.lineHeight}px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
`;

const InfoText = styled(Text)`
    font-weight: 400;
    font-family: SansationLight !important;
    text-overflow: ellipsis;
    &,
    strong {
        font-style: normal;

        font-size: 20px;
        line-height: 24px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }

    strong {
        font-weight: bold;
        font-family: SansationBold !important;
    }

    i {
        font-style: italic;
    }

    img {
        vertical-align: bottom;
    }
`;

const Link = styled.a`
    font-family: SansationBold !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    margin-left: 4px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
    &:hover {
        font-weight: bold;
        text-decoration: underline;
    }
`;

const ScoreboardInfoSection = styled.div`
    color: var(--color);
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    > * {
        > * {
            font-family: SansationLight !important;
            &:nth-child(1) {
                padding-right: 7px;
            }
            &:nth-child(2) {
                font-family: basis33 !important;
                font-weight: bold;
                font-size: 28px;
            }
            &:nth-child(3) {
                padding-left: 7px;
            }
        }
    }
    @media (min-width: 1025px) {
        display: none;
    }
`;

export default Scoreboard;
