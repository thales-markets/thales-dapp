import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, Wrapper } from 'theme/common';
import Cookies from 'universal-cookie';
import { getIsOVM } from 'utils/network';
import Header from './components/Header';
import WalletNotConnectedDialog from './components/WalletNotConnectedDialog/WalletNotConnectedDialog';
import { WrongNetworkDialog } from './components/WrongNetworkDialog/WrongNetworkDialog';
import { FooterV2 } from './V2/components/Footer';

import { ScoreboardPage } from './V2/components/ScoreboardPage';

export enum Theme {
    Light,
    Dark,
}

const cookies = new Cookies();

const ThalesRoyal: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const isL2 = getIsOVM(networkId);
    const [theme, setTheme] = useState(Number(cookies.get('theme')) === 0 ? Theme.Light : Theme.Dark);
    const [openNetworkWarningDialog, setOpenNetworkWarningDialog] = useState(false);
    const [openWalletNotConnectedDialog, setOpenWalletNotConnectedDialog] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');

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
            !walletAddress ? setOpenWalletNotConnectedDialog(true) : setOpenWalletNotConnectedDialog(false);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [walletAddress]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            walletAddress && !isL2 ? setOpenNetworkWarningDialog(true) : setOpenNetworkWarningDialog(false);
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
                <ScoreboardPage />
                <FooterV2 selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
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
