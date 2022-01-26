import React, { useState } from 'react';

import styled from 'styled-components';

import UserWallet from 'components/UserInfo/v2/UserWallet';
import PieChartUserBalance from 'components/Charts/PieChartUserBalance';
import PriceChart from 'components/Charts/PriceChart';
import LanguageCardSelector from 'components/LanguageSelector/v3/LanguageCardSelector';
import NetworkSwitchSection from 'components/NetworkSwitch/v2/NetworkSwitch';
import ThemeSelector from 'components/ThemeSelector/ThemeSelector';
import OutsideClickHandler from 'react-outside-click-handler';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { getTheme } from 'redux/modules/ui';

export const UserCard: React.FC = () => {
    const [showCard, setShowCard] = useState(false);

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const theme = useSelector((state: RootState) => getTheme(state));

    return (
        <>
            <MenuCardButton onClick={() => setShowCard(!showCard)}>
                <MenuIcon className="sidebar-icon icon--card-menu" />
            </MenuCardButton>
            <OutsideClickHandler onOutsideClick={() => (showCard ? setShowCard(!showCard) : '')}>
                <MenuCard visibility={showCard} className={theme == 0 ? 'light' : 'dark'}>
                    <CloseIcon className="icon icon--x-sign" onClick={() => setShowCard(!showCard)} />
                    <CardWrapper>
                        <LogoContainer>
                            <ThalesLogo className="icon icon--logo" />
                        </LogoContainer>
                        <UserWallet />
                        {isWalletConnected && <PieChartUserBalance />}
                        <PriceChart currencyKey={'THALES'} showHeading={true} />
                        <ThemeSelector />
                        {isWalletConnected && <NetworkSwitchSection />}
                        <LanguageCardSelector />
                    </CardWrapper>
                </MenuCard>
            </OutsideClickHandler>
            <Overlay className={showCard ? 'show' : 'hide'} />
        </>
    );
};

interface ManuCardProps {
    visibility: boolean;
}

export const Overlay = styled.div`
    position: fixed;
    min-height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: #748bc6;
    opacity: 0.4;
    z-index: 1;
    backdrop-filter: blur(10px);
    &.show {
        display: block;
    }
    &.hide {
        display: none;
    }
`;

const MenuCardButton = styled.div`
    position: absolute;
    top: 55px;
    right: 44px;
    width: 50px;
    heigth: 20px;
    cursor: pointer;
`;

const MenuIcon = styled.i`
    color: var(--primary-color);
`;

const MenuCard = styled.div<ManuCardProps>`
    display: ${({ visibility }) => (visibility ? 'block' : 'none')};
    position: fixed;
    width: 241px;
    right: 35px;
    top: 35px;
    border: 1px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 15px;
    z-index: 3;
    &.light {
        background-color: #f7f7f7;
        --background: #f7f7f7;
        --icon-color: #04045a;
        --shadow-color: '#64D9FErgba(4, 4, 90, 0.4)';
    }
    &.dark {
        background-color: #04045a;
        --background: #04045a;
        --icon-color: #f7f7f7;
        --shadow-color: '#64D9FE';
    }
    box-shadow: var(--shadow);
`;

const CardWrapper = styled.div`
    padding: 33px;
`;

const CloseIcon = styled.i`
    position: absolute;
    top: 22px;
    right: 19px;
    font-size: 10px;
    cursor: pointer;
    color: var(--icon-color);
`;

const LogoContainer = styled.div`
    line-height: 30px;
    margin: 14px auto 22px auto;
    width: 100%;
    text-align: center;
`;

const ThalesLogo = styled.i`
    color: var(--icon-color);
    font-size: 140px;
`;

export default UserCard;
