import React, { lazy, Suspense, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const MenuCardComponent = lazy(() => import(/* webpackChunkName: "MenuCardComponent" */ './MenuCard'));
const UserWallet = lazy(() => import(/* webpackChunkName: "UserWallet" */ './UserWallet'));
const Notification = lazy(() => import(/* webpackChunkName: "Notification" */ './Notifications'));

const UserCard: React.FC = () => {
    const [showCard, setShowCard] = useState(false);
    const { trackEvent } = useMatomo();

    useEffect(() => {
        document.getElementsByTagName('body')[0]?.style.setProperty('overflow', showCard ? 'hidden' : 'auto');
    }, [showCard]);

    return (
        <>
            <Suspense fallback={<></>}>
                <UserWallet />
            </Suspense>

            <Suspense fallback={<></>}>
                <Notification />
            </Suspense>

            <MenuCardButton
                onClick={() => {
                    trackEvent({
                        category: 'dAppHeader',
                        action: 'click-on-open-user-card',
                    });
                    setShowCard(!showCard);
                }}
            >
                <MenuIcon style={{ fontSize: 26 }} className="sidebar-icon icon--card-menu" />
            </MenuCardButton>
            {showCard && (
                <Suspense fallback={<></>}>
                    <OutsideClickHandler onOutsideClick={() => (showCard ? setShowCard(!showCard) : '')}>
                        <MenuCardComponent showCard={showCard} setShowCard={setShowCard} />
                    </OutsideClickHandler>
                </Suspense>
            )}
            <Overlay className={showCard ? 'show' : 'hide'} />
        </>
    );
};

const Overlay = styled.div`
    position: fixed;
    min-height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    z-index: 1501;
    transition: opacity 2s;
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
    top: 40px;
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
    color: ${(props) => props.theme.textColor.primary};
`;

export default UserCard;
