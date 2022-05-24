import UserWallet from './UserWallet';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import styled from 'styled-components';

import UserSwap from './UserSwap';

const MenuCardComponent = lazy(() => import(/* webpackChunkName: "MenuCardComponent" */ './MenuCard'));

const UserCard: React.FC = () => {
    const [showCard, setShowCard] = useState(false);

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
                <Suspense fallback={<></>}>
                    <MenuCardComponent showCard={showCard} setShowCard={setShowCard} />
                </Suspense>
            </OutsideClickHandler>
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

export default UserCard;
