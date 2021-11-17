import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, FlexDivCentered, Wrapper, Text } from 'theme/common';
import BattleRoyale from './components/BattleRoyale';
import Scoreboard from './components/Scoreboard';
import { getEthPrice, getPositions, getThalesRoyalData, getUsers, ThalesRoyalData, User } from './getThalesRoyalData';
import useInterval from '../../../hooks/useInterval';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import { navigateTo } from '../../../utils/routes';
import ROUTES from '../../../constants/routes';
import { WrongNetworkDialog } from './components/WrongNetworkDialog/WrongNetworkDialog';

export enum Theme {
    Light,
    Dark,
}

const ThalesRoyal: React.FC = () => {
    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [thalesRoyalData, setData] = useState<undefined | ThalesRoyalData>(undefined);
    const [showBattle, setShowBattle] = useState<boolean>(false);
    const [fetchNewData, setFetchNewData] = useState<number>(Date.now());
    const [ethPrice, setEthPrice] = useState<string | undefined>('');
    const [theme, setTheme] = useState(Theme.Light);
    const [positions, setPositions] = useState({ up: 0, down: 0 });
    const [user, setUser] = useState<User>();
    const [openNetworkWarningDialog, setOpenNetworkWarningDialog] = useState(false);

    useEffect(() => {
        if (walletAddress && networkId === 69) {
            getThalesRoyalData(walletAddress).then((data) => {
                setData(data);
                getEthPrice().then((data) => setEthPrice(data));
                getPositions(data.round).then((data) => setPositions(data));
            });
        }
    }, [walletAddress, networkId, fetchNewData]);

    useEffect(() => {
        getUsers(walletAddress, () => {}, setUser);
    }, [walletAddress]);

    useEffect(() => {
        walletAddress && networkId !== 69 ? setOpenNetworkWarningDialog(true) : setOpenNetworkWarningDialog(false);
    }, [networkId]);

    useInterval(async () => {
        setEthPrice(await getEthPrice());
    }, 10000);

    return (
        <RoyaleBackground className={theme === Theme.Light ? 'light-theme' : 'dark-theme'} id="royale-background">
            <Wrapper
                className={showBattle ? 'wrapper--showBattle' : 'wrapper--showScoreboard'}
                style={{ position: 'relative', paddingLeft: 30 }}
            >
                <Header theme={theme} setTheme={setTheme}></Header>
                {thalesRoyalData && <Scoreboard royaleData={thalesRoyalData}></Scoreboard>}
                {thalesRoyalData && (
                    <BattleRoyale
                        positions={positions}
                        setPositions={setPositions}
                        royaleData={thalesRoyalData}
                        setFetchNewData={setFetchNewData}
                    />
                )}
            </Wrapper>
            <Footer>
                <Nav>
                    {!showBattle && (
                        <NavButton onClick={() => navigateTo(ROUTES.Options.Home)}>
                            <i className="icon icon--left" />
                            <Text> Thales dApp </Text>
                        </NavButton>
                    )}
                    {showBattle && (
                        <NavButton onClick={() => setShowBattle(false)}>
                            <i className="icon icon--left" />
                            <Text> Scoreboard </Text>
                        </NavButton>
                    )}
                    {!showBattle && (
                        <NavButton onClick={() => setShowBattle(true)}>
                            <Text> Battle </Text>
                            <i className="icon icon--right" />
                        </NavButton>
                    )}
                </Nav>

                <InfoSection>
                    {user?.deathRound && (
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
                        <span>{t('options.royale.footer.reward-per-player')}:</span>
                        <span>{(10000 / (Number(thalesRoyalData?.alivePlayers?.length) || 1)).toFixed(2)} THALES</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.players-alive')}:</span>
                        <span>{thalesRoyalData?.alivePlayers?.length + ' / ' + thalesRoyalData?.players?.length}</span>
                    </div>
                </InfoSection>
            </Footer>
            <WrongNetworkDialog
                open={openNetworkWarningDialog}
                setOpen={setOpenNetworkWarningDialog}
            ></WrongNetworkDialog>
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
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 50px 120px;
    align-items: flex-end;
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    width: 275px;
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

const InfoSection = styled.div`
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
