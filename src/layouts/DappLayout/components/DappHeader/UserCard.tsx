import PieChartUserBalance from 'components/Charts/PieChartUserBalance';
import PriceChart from 'components/Charts/PriceChart';
import LanguageCardSelector from 'components/LanguageSelector/v3/LanguageCardSelector';
import NetworkSwitchSection from 'components/NetworkSwitch/v2/NetworkSwitch';
import ThalesBalance from 'components/ThalesBalance/ThalesBalance';
import ThemeSelector from 'components/ThemeSelector/ThemeSelector';
import UserWallet from 'layouts/DappLayout/components/DappHeader/UserWallet';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { getTheme } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import DisplayNameForm from '../../../../components/DisplayNameForm/DisplayNameForm';
import UserSwap from './UserSwap';
import UserWalletExpanded from './UserWalletExpanded';
import { getIsPolygon } from 'utils/network';

export const UserCard: React.FC = () => {
    const [showCard, setShowCard] = useState(false);

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const theme = useSelector((state: RootState) => getTheme(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);

    useEffect(() => {
        document.getElementsByTagName('body')[0]?.style.setProperty('overflow', showCard ? 'hidden' : 'auto');
    }, [showCard]);

    return (
        <>
            <UserSwap />
            <UserWallet />
            <MenuCardButton
                onClick={() => {
                    setShowCard(!showCard);
                }}
            >
                <MenuIcon style={{ fontSize: 30 }} className="sidebar-icon icon--card-menu" />
            </MenuCardButton>
            <OutsideClickHandler onOutsideClick={() => (showCard ? setShowCard(!showCard) : '')}>
                <MenuCard visibility={showCard} className={theme == 0 ? 'light' : 'dark'}>
                    <CloseIcon className="icon icon--x-sign" onClick={() => setShowCard(!showCard)} />
                    <CardWrapper>
                        <LogoContainer>
                            <ThalesLogo className="icon icon--logo" />
                        </LogoContainer>
                        <UserWalletExpanded />
                        {isWalletConnected && <NetworkSwitchSection setShowCard={setShowCard} />}
                        <Container>
                            {isWalletConnected && <PieChartUserBalance />}
                            {isWalletConnected && !isPolygon && <ThalesBalance />}
                        </Container>

                        <PriceChart currencyKey={'THALES'} showHeading={true} />
                        {isWalletConnected && <DisplayNameForm />}
                        <ThemeSelector />
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

const Overlay = styled.div`
    position: fixed;
    min-height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: 10;
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

const Container = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        & > div {
            width: 50%;
        }
    }
`;

const MenuCardButton = styled.div`
    position: absolute;
    top: 0;
    right: 20px;
    width: 50px;
    cursor: pointer;
    @media (max-width: 1024px) {
        right: 0;
        top: 20px;
    }

    @media (max-width: 400px) {
        width: 40px;
    }
`;

const MenuIcon = styled.i`
    color: var(--primary-color);
`;

const MenuCard = styled.div<ManuCardProps>`
    display: ${({ visibility }) => (visibility ? 'block' : 'none')};
    position: absolute;
    max-width: 280px;
    right: 35px;
    max-height: 95vh;
    overflow-y: auto;
    top: 0;
    border: 1px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 15px;
    z-index: 1000;
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
    @media (max-width: 1024px) {
        width: 100%;
        max-width: 100%;
        max-height: unset;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        border-radius: 0;
        border: none;
        position: fixed;
    }
    box-shadow: var(--shadow);
`;

const CardWrapper = styled.div`
    padding: 24px;
    max-width: 600px;
    margin: auto;

    @media (max-width: 568px) {
        padding: 24px 12px;
    }
`;

const CloseIcon = styled.i`
    position: absolute;
    top: 22px;
    right: 19px;
    font-size: 16px;
    padding: 4px;
    box-sizing: content-box;
    cursor: pointer;
    color: var(--icon-color);
`;

const LogoContainer = styled.div`
    line-height: 30px;
    margin: 14px auto 16px auto;
    width: 100%;
    text-align: center;
    @media (max-width: 1024px) {
        margin: 0 0 10px 0px;
    }
`;

const ThalesLogo = styled.i`
    color: var(--icon-color);
    font-size: 140px;
`;

export default UserCard;
