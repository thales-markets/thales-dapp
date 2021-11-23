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
import useThalesRoyaleData from './Queries/useThalesRoyaleData';
import useEthPriceQuery from './Queries/useEthPriceQuery';
import useRoyalePlayersQuery, { User } from './Queries/useRoyalePlayersQuery';

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

    const royaleDataQuery = useThalesRoyaleData(walletAddress as any, { enabled: networkId === 69 });
    const thalesRoyalData = royaleDataQuery.isSuccess ? royaleDataQuery.data : undefined;

    const usersQuery = useRoyalePlayersQuery({ enabled: networkId === 69 });
    const users = usersQuery.isSuccess ? usersQuery.data : [];
    const user = users.filter(
        (user: User) => walletAddress && user.address.toLowerCase() === walletAddress.toLowerCase()
    )[0];

    const positionsQuery = usePositionsQuery(networkId, { enabled: networkId !== undefined });
    const positions = positionsQuery.isSuccess ? positionsQuery.data : { up: 0, down: 0 };

    const ethPriceQuery = useEthPriceQuery(thalesRoyalData?.priceFeedAddress as any, {
        enabled: thalesRoyalData !== undefined,
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
        if (selectedPage === 'battle') {
            if (thalesRoyalData && thalesRoyalData.signUpPeriod < new Date() && !thalesRoyalData?.canStartRoyale) {
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
    }, [selectedPage]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            !walletAddress ? setOpenWalletNotConnectedDialog(true) : setOpenWalletNotConnectedDialog(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [walletAddress]);

    useEffect(() => {
        walletAddress && networkId !== 69 ? setOpenNetworkWarningDialog(true) : setOpenNetworkWarningDialog(false);
    }, [networkId, walletAddress]);

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
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
                className={selectedPage === 'battle' ? 'wrapper--showBattle' : 'wrapper--showScoreboard'}
                style={{ position: 'relative', paddingLeft: 30 }}
            >
                <Header theme={theme} setTheme={setTheme} />
                <Scoreboard
                    ethPrice={ethPrice}
                    positions={positions}
                    royaleData={thalesRoyalData as any}
                    user={user}
                    users={users}
                />
                {thalesRoyalData && (
                    <BattleRoyale royaleData={thalesRoyalData} showBattle={selectedPage === 'battle'} />
                )}
            </Wrapper>
            <Footer>
                <Nav>
                    {selectedPage !== 'battle' && (
                        <NavButton onClick={() => navigateTo(ROUTES.Options.Home)}>
                            <i className="icon icon--left" />
                            <Text> Thales dApp </Text>
                        </NavButton>
                    )}
                    {selectedPage === 'battle' && (
                        <NavButton onClick={() => setSelectedPage('scoreboard')}>
                            <i className="icon icon--left" />
                            <Text>{t('options.royale.footer.scoreboard')}</Text>
                        </NavButton>
                    )}
                    {selectedPage !== 'battle' && (
                        <NavButton
                            className={
                                (thalesRoyalData && thalesRoyalData.signUpPeriod > new Date()) ||
                                thalesRoyalData?.canStartRoyale
                                    ? 'disabled'
                                    : ''
                            }
                            onClick={() => {
                                if (
                                    thalesRoyalData &&
                                    thalesRoyalData.signUpPeriod < new Date() &&
                                    !thalesRoyalData?.canStartRoyale
                                ) {
                                    setSelectedPage('battle');
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
                <InfoSection>
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
                        <span>{t('options.royale.footer.up')}</span>
                        <span>{`${positions.up} ${t('options.royale.footer.vs')} ${positions.down}`}</span>
                        <span>{t('options.royale.footer.down')}</span>
                    </div>
                    <div>
                        <span>
                            {t('options.royale.footer.current')} ETH {t('options.royale.footer.price')}:
                        </span>
                        <span>{ethPrice}$</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.current-reward-per-player')}:</span>
                        <span>{(10000 / (Number(thalesRoyalData?.alivePlayers?.length) || 1)).toFixed(2)} THALES</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.players-alive')}:</span>
                        <span>{thalesRoyalData?.alivePlayers?.length + ' / ' + thalesRoyalData?.players?.length}</span>
                    </div>
                </InfoSection>
            </Footer>
            <WrongNetworkDialog open={openNetworkWarningDialog} setOpen={setOpenNetworkWarningDialog} />
            <WalletNotConnectedDialog open={openWalletNotConnectedDialog} setOpen={setOpenWalletNotConnectedDialog} />
        </RoyaleBackground>
    );
};

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
    padding: 50px 30px 50px 50px;
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
    @media (min-width: 1024px) {
        bottom: 0;
    }
`;

const Separator = styled.span`
    padding: 0px 10px;
    @media (min-width: 1024px) {
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

export const InfoSection = styled.div`
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
                font-family: VT323 !important;
                font-weight: bold;
                font-size: 28px;
            }
            &:nth-child(3) {
                padding-left: 7px;
            }
        }
    }
`;

export default ThalesRoyal;
