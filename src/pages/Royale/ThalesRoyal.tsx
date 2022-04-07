import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, Wrapper } from 'theme/common';
import Cookies from 'universal-cookie';
import { getIsOVM } from 'utils/network';
import WalletNotConnectedDialog from 'pages/Options/components/WalletNotConnectedDialog/WalletNotConnectedDialog';
import { getIsAppReady } from 'redux/modules/app';
import RoyaleArena from './components/Arena/RoyaleArena';
import FooterV2 from './components/Footer/Footer';
import Header from './components/Header';
import ScoreboardPage from './components/Scoreboard/ScoreboardPage';
import WrongNetworkDialog from './components/WrongNetworkDialog/WrongNetworkDialog';
import useLatestSeasonQuery from './Queries/useLatestSeasonQuery';
import usePositionsQuery, { Positions } from './Queries/usePositionsQuery';
import useRoyaleFooterQuery, { FooterData } from './Queries/useRoyaleFooterQuery';
import useRoyaleAssetPriceQuery from './Queries/useRoyaleAssetPriceQuery';

export enum Theme {
    Light,
    Dark,
}

const cookies = new Cookies();

const ThalesRoyal: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const latestSeasonQuery = useLatestSeasonQuery({
        enabled: isAppReady && isL2,
    });
    const [selectedSeason, setSelectedSeason] = useState(0);
    const [royaleFooterData, setRoyaleStatsData] = useState<FooterData>();
    const [assetPrice, setAssetPrice] = useState<string>('');

    const [positions, setPositions] = useState<Positions>({ up: 0, down: 0 });

    const latestSeason = latestSeasonQuery.isSuccess ? latestSeasonQuery.data : 0;

    const royaleFooterQuery = useRoyaleFooterQuery(selectedSeason, { enabled: isAppReady });
    const royaleAssetPriceQuery = useRoyaleAssetPriceQuery(royaleFooterQuery.data?.seasonAsset, {
        enabled: isAppReady,
    });
    const positionsQuery = usePositionsQuery(selectedSeason, networkId, {
        enabled: networkId !== undefined && isAppReady,
    });

    const [theme, setTheme] = useState(Number(cookies.get('theme')) === 0 ? Theme.Light : Theme.Dark);
    const [openNetworkWarningDialog, setOpenNetworkWarningDialog] = useState(false);
    const [openWalletNotConnectedDialog, setOpenWalletNotConnectedDialog] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');

    useEffect(() => {
        if (positionsQuery.isSuccess) {
            setPositions(positionsQuery.data);
        }
    }, [positionsQuery.isSuccess, positionsQuery.data]);

    useEffect(() => {
        if (royaleAssetPriceQuery.isSuccess) {
            setAssetPrice(royaleAssetPriceQuery.data);
        }
    }, [
        royaleAssetPriceQuery.isSuccess,
        royaleAssetPriceQuery.data,
        royaleFooterQuery.isSuccess,
        royaleFooterQuery.data,
    ]);

    useEffect(() => {
        if (royaleFooterQuery.isSuccess) {
            setRoyaleStatsData(royaleFooterQuery.data);
        }
    }, [royaleFooterQuery.isSuccess, royaleFooterQuery.data]);

    useEffect(() => {
        royaleFooterQuery.refetch().then((resp) => {
            setRoyaleStatsData(resp.data);
        });
    }, [selectedSeason]);

    useEffect(() => {
        setSelectedSeason(latestSeasonQuery.data || 0);
    }, [latestSeasonQuery.isSuccess, latestSeasonQuery.data]);

    useEffect(() => {
        const selectedPageParameter = queryString.parse(location.search).page;

        if (!selectedPageParameter) {
            setSelectedPage('scoreboard');
        } else {
            setSelectedPage(selectedPageParameter);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            !isWalletConnected ? setOpenWalletNotConnectedDialog(true) : setOpenWalletNotConnectedDialog(false);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [isWalletConnected]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            isWalletConnected && !isL2 ? setOpenNetworkWarningDialog(true) : setOpenNetworkWarningDialog(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [networkId, isWalletConnected]);

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
                <Header
                    latestSeason={latestSeason}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    theme={theme}
                    setTheme={setTheme}
                />
                <ScoreboardPage
                    assetPrice={assetPrice}
                    positions={positions}
                    royaleFooterData={royaleFooterData}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    latestSeason={latestSeason}
                />
                <RoyaleArena
                    assetPrice={assetPrice}
                    positions={positions}
                    royaleFooterData={royaleFooterData}
                    latestSeason={latestSeason}
                    selectedSeason={selectedSeason}
                    showBattle={selectedPage === 'royale'}
                />
                <FooterV2
                    assetPrice={assetPrice}
                    positions={positions}
                    royaleData={royaleFooterData}
                    latestSeason={latestSeason}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                />
            </Wrapper>

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
    @media (max-width: 1024px) {
        overflow-y: auto;
        max-height: 100vh;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
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
