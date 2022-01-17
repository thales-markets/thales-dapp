import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, FlexDivCentered, Text, Wrapper } from 'theme/common';
import Cookies from 'universal-cookie';
import ROUTES from '../../../constants/routes';
import { history, navigateTo } from '../../../utils/routes';
import BattleRoyale from './components/BattleRoyale';
import Header from './components/Header';
import Scoreboard from './components/Scoreboard';
import WalletNotConnectedDialog from './components/WalletNotConnectedDialog/WalletNotConnectedDialog';
import { WrongNetworkDialog } from './components/WrongNetworkDialog/WrongNetworkDialog';
import queryString from 'query-string';
import usePositionsQuery from './Queries/usePositionsQuery';
import useThalesRoyaleData, { ThalesRoyaleData } from './Queries/useThalesRoyaleData';
import useEthPriceQuery from './Queries/useEthPriceQuery';
import useRoyalePlayersQuery, { User } from './Queries/useRoyalePlayersQuery';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import { RoyaleTooltip } from '../Market/components';

export enum Theme {
    Light,
    Dark,
}

const cookies = new Cookies();

const ThalesRoyal: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [theme, setTheme] = useState(Number(cookies.get('theme')) === 0 ? Theme.Light : Theme.Dark);
    const [openNetworkWarningDialog, setOpenNetworkWarningDialog] = useState(false);
    const [openWalletNotConnectedDialog, setOpenWalletNotConnectedDialog] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');
    const [showStats, setShowStats] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<number>(0);
    const [allSeasons, setAllSeasons] = useState([] as any);
    const [thalesRoyaleData, setThalesRoyaleData] = useState<ThalesRoyaleData>();

    const royaleDataQuery = useThalesRoyaleData(walletAddress as any, {
        enabled: networkId === 69 || networkId === 10,
    });

    const thalesRoyaleDataMap = royaleDataQuery.isSuccess ? royaleDataQuery.data : undefined;

    const usersQuery = useRoyalePlayersQuery(networkId, selectedSeason, {
        enabled: networkId === 69 || networkId === 10,
    });
    const users = usersQuery.isSuccess ? usersQuery.data : [];
    const user = users.filter(
        (user: User) => walletAddress && user.address.toLowerCase() === walletAddress.toLowerCase()
    )[0];

    const positionsQuery = usePositionsQuery(selectedSeason, networkId, { enabled: networkId !== undefined });
    const positions = positionsQuery.isSuccess ? positionsQuery.data : { up: 0, down: 0 };
    const ethPriceQuery = useEthPriceQuery(thalesRoyaleData?.priceFeedAddress as any, {
        enabled: thalesRoyaleData !== undefined,
    });
    const ethPrice = ethPriceQuery.isSuccess ? ethPriceQuery.data : '';

    useEffect(() => {
        const selectedPageParameter = queryString.parse(location.search).page;

        if (!selectedPageParameter) {
            setSelectedPage('scoreboard');
        } else {
            setSelectedPage(selectedPageParameter);
        }
    }, []);

    useEffect(() => {
        if (thalesRoyaleDataMap) {
            if (selectedSeason === 0) {
                setSelectedSeason(Number(Array.from(thalesRoyaleDataMap.keys()).pop()));
            }
            setAllSeasons(Array.from(thalesRoyaleDataMap.keys()));
            setThalesRoyaleData(thalesRoyaleDataMap.get(selectedSeason));
        }
    }, [thalesRoyaleDataMap]);

    useEffect(() => {
        selectedSeason ? setThalesRoyaleData(thalesRoyaleDataMap?.get(selectedSeason)) : '';
    }, [selectedSeason]);

    useEffect(() => {
        if (thalesRoyaleData) {
            if (selectedPage === 'royale') {
                if (thalesRoyaleData.roundInASeason > 0) {
                    history.push({
                        pathname: location.pathname,
                        search: queryString.stringify({
                            page: selectedPage,
                        }),
                    });
                } else {
                    history.push({
                        pathname: location.pathname,
                        search: queryString.stringify({
                            page: 'scoreboard',
                        }),
                    });
                    setSelectedPage('scoreboard');
                }
            } else {
                history.push({
                    pathname: location.pathname,
                    search: queryString.stringify({
                        page: selectedPage,
                    }),
                });
            }
        }
    }, [selectedPage, thalesRoyaleData]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            !walletAddress ? setOpenWalletNotConnectedDialog(true) : setOpenWalletNotConnectedDialog(false);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [walletAddress]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            walletAddress && networkId !== 69 && networkId !== 10
                ? setOpenNetworkWarningDialog(true)
                : setOpenNetworkWarningDialog(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [networkId, walletAddress]);

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        const html = document.documentElement;
        html.classList.remove(theme === Theme.Light ? 'dark-theme' : 'light-theme');
        html.classList.add(theme !== Theme.Light ? 'dark-theme' : 'light-theme');
        body.classList.remove(theme === Theme.Light ? 'dark-theme' : 'light-theme');
        body.classList.add(theme !== Theme.Light ? 'dark-theme' : 'light-theme');
    }, [theme]);

    useEffect(() => {
        return () => {
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove('dark-theme');
            body.classList.remove('light-theme');
        };
    }, []);

    return (
        <RoyaleBackground className={theme === Theme.Light ? 'light-theme' : 'dark-theme'} id="royale-background">
            <Wrapper
                className={selectedPage === 'royale' ? 'wrapper--showBattle' : 'wrapper--showScoreboard'}
                style={{ position: 'relative', paddingLeft: 30 }}
            >
                <Header theme={theme} setTheme={setTheme} />
                <Scoreboard
                    ethPrice={ethPrice}
                    positions={positions}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    allSeasons={allSeasons}
                    royaleData={thalesRoyaleData as any}
                    user={user}
                    users={users}
                />
                {thalesRoyaleData && (
                    <BattleRoyale
                        ethPrice={ethPrice}
                        positions={positions}
                        royaleData={thalesRoyaleData}
                        showBattle={selectedPage === 'royale'}
                        user={user}
                        selectedSeason={selectedSeason}
                    />
                )}
            </Wrapper>
            <Footer>
                <Nav>
                    {selectedPage !== 'royale' && (
                        <NavButton onClick={() => navigateTo(ROUTES.Options.Home)}>
                            <i className="icon icon--left" />
                            <Text> Thales dApp </Text>
                        </NavButton>
                    )}
                    {selectedPage === 'royale' && (
                        <NavButton onClick={() => setSelectedPage('scoreboard')}>
                            <i className="icon icon--left" />
                            <Text>{t('options.royale.footer.scoreboard')}</Text>
                        </NavButton>
                    )}
                    {selectedPage !== 'royale' && (
                        <NavButton
                            className={thalesRoyaleData?.roundInASeason === 0 ? 'disabled' : ''}
                            onClick={() => {
                                if (thalesRoyaleData && thalesRoyaleData.roundInASeason > 0) {
                                    setSelectedPage('royale');
                                }
                            }}
                        >
                            <Separator>|</Separator>
                            <Text>{t('options.royale.footer.royale')}</Text>
                            <i className="icon icon--right" />
                        </NavButton>
                    )}
                </Nav>
                <div />
                <StatsButtonWrapper>
                    <StatsIcon onClick={() => setShowStats(true)} className="icon icon--stats" />
                    <StatsButton onClick={() => setShowStats(true)}>{t('options.royale.footer.stats')}</StatsButton>
                </StatsButtonWrapper>
            </Footer>
            <InfoSection style={{ visibility: showStats === true ? 'visible' : 'hidden' }}>
                <CloseStats onClick={() => setShowStats(false)}>✖</CloseStats>
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
                    <span>{t('options.royale.footer.current-positions')}:</span>
                    <span>{t('options.royale.footer.up')}</span>
                    <span>{`${positions.up} ${t('options.royale.footer.vs')}  ${positions.down}`}</span>
                    <span>{t('options.royale.footer.down')}</span>
                </div>
                <div>
                    <span>
                        {t('options.royale.footer.current')} ETH {t('options.royale.footer.price')}:
                    </span>
                    <span>${ethPrice}</span>
                    <InfoIconContainer>
                        <RoyaleTooltip title={t('options.royale.footer.price-source')}>
                            <StyledInfoIcon />
                        </RoyaleTooltip>
                    </InfoIconContainer>
                </div>
                <div>
                    <span>{t('options.royale.footer.reward-per-player')}:</span>
                    <span>
                        {(
                            10000 /
                            (thalesRoyaleData?.roundsInformation[thalesRoyaleData.roundInASeason - 1]
                                ?.totalPlayersPerRoundPerSeason || 1)
                        ).toFixed(2)}{' '}
                        THALES
                    </span>
                </div>
                <div>
                    <span>{t('options.royale.footer.players-alive')}:</span>
                    <span>
                        {}
                        {thalesRoyaleData?.roundsInformation[thalesRoyaleData.roundInASeason - 1]
                            ?.totalPlayersPerRoundPerSeason +
                            ' / ' +
                            thalesRoyaleData?.players?.length}
                    </span>
                </div>
            </InfoSection>
            <WrongNetworkDialog open={openNetworkWarningDialog} setOpen={setOpenNetworkWarningDialog} />
            <WalletNotConnectedDialog open={openWalletNotConnectedDialog} setOpen={setOpenWalletNotConnectedDialog} />
        </RoyaleBackground>
    );
};

const InfoIconContainer = styled.span`
    display: inline-flex;
    align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
    width: 15px;
    height: 15px;
    path {
        fill: var(--color);
    }
`;

export const RoyaleBackground = styled(Background)`
    &.light-theme {
        --color-background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        --color-wrapper: #04045a;
        --color: #64d9fe;
    }
    &.dark-theme {
        --color-background: linear-gradient(180deg, #1e4c39 0%, #07150f 117.72%);
        --color-wrapper: #133326;
        --color: #a1e1b4;
    }
    background: var(--color-background);
    .wrapper--showBattle {
        .scoreboard {
            display: none;
        }
    }
    .wrapper--showScoreboard {
        .battle {
            display: none;
        }
    }
`;

const Footer = styled.div`
    position: fixed;
    display: grid;
    grid-template-columns: 2fr 5fr 2fr;
    width: 100%;
    padding: 50px;
    align-items: flex-end;
    @media (max-width: 1024px) {
        position: absolute;
        top: 0;
        padding: 17px;
        > * {
            &:nth-child(1) {
                justify-content: flex-start;
            }
            &:nth-child(2) {
                display: none;
            }
            &:nth-child(3) {
                display: none;
            }
        }
    }
    @media (min-width: 1025px) {
        bottom: 0;
    }
`;

const Separator = styled.span`
    padding: 0px 10px;
    @media (min-width: 1025px) {
        display: none;
    }
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    width: 275px;
    @media (max-width: 1200px) {
        width: auto;
    }
    @media (max-width: 1024px) {
        width: 275px;
    }
`;

const NavButton = styled(FlexDivCentered)`
    justify-content: space-around;
    cursor: pointer;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: var(--color);
    > span {
        font-family: SansationLight !important;
    }
    &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
    }
    img {
        margin: 0 10px;
    }
`;

const StatsButtonWrapper = styled.div`
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: var(--color);
    display: flex;
    justify-content: flex-end;
`;

const StatsButton = styled.span`
    cursor: pointer;
    padding-left: 10px;
    line-height: 27px;
`;

const CloseStats = styled.span`
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 10px;
`;

const StatsIcon = styled.i`
    cursor: pointer;
`;

export const InfoSection = styled.div`
    color: var(--color);
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    border: 5px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 1.5em;
    position: fixed;
    z-index: 1000;
    right: 30px;
    bottom: 30px;
    background: var(--color-background);
    > * {
        margin-bottom: 0.1em;
        > * {
            font-family: SansationLight !important;
            &:nth-child(2),
            &:first-child {
                padding-right: 7px;
            }
            &:nth-child(3) {
                font-family: basis33 !important;
                font-weight: bold;
                font-size: 28px;
            }
            &:nth-child(4) {
                padding-left: 7px;
            }
        }
    }
    @media (max-width: 1024px) {
        display: none;
    }
`;

export default ThalesRoyal;
