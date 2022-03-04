import React, { useState } from 'react';

import styled from 'styled-components';

import UserWallet from 'layouts/DappLayout/components/DappHeader/UserWallet';
import PieChartUserBalance from 'components/Charts/PieChartUserBalance';
import PriceChart from 'components/Charts/PriceChart';
import LanguageCardSelector from 'components/LanguageSelector/v3/LanguageCardSelector';
import NetworkSwitchSection from 'components/NetworkSwitch/v2/NetworkSwitch';
import ThemeSelector from 'components/ThemeSelector/ThemeSelector';
import OutsideClickHandler from 'react-outside-click-handler';
import DisplayNameForm from './DisplayNameForm';

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
            <UserWallet
                style={{ position: 'absolute', top: '55px', right: '110px' }}
                walletContainerStyle={{ margin: '0px', border: '1px solid rgba(100, 217, 254, 0.5)' }}
            />
            <MenuCardButton onClick={() => setShowCard(!showCard)}>
                <MenuIcon style={{ fontSize: 30 }} className="sidebar-icon icon--card-menu" />
            </MenuCardButton>
            <OutsideClickHandler onOutsideClick={() => (showCard ? setShowCard(!showCard) : '')}>
                <MenuCard visibility={showCard} className={theme == 0 ? 'light' : 'dark'}>
                    <CloseIcon className="icon icon--x-sign" onClick={() => setShowCard(!showCard)} />
                    <CardWrapper>
                        <LogoContainer>
                            <ThalesLogo className="icon icon--logo" />
                        </LogoContainer>
                        <UserWallet expandedView={true} />
                        {isWalletConnected && <PieChartUserBalance />}
                        <PriceChart currencyKey={'THALES'} showHeading={true} />
                        {isWalletConnected && <DisplayNameForm />}
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
    width: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: 1;
    transition: opacity 2s;
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.06) -2.8%, rgba(255, 255, 255, 0.02) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4px);
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
    max-height: 90vh;
    overflow-y: auto;
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
    padding: 26px;
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
    margin: 14px auto 16px auto;
    width: 100%;
    text-align: center;
`;

const ThalesLogo = styled.i`
    color: var(--icon-color);
    font-size: 140px;
`;

export default UserCard;
