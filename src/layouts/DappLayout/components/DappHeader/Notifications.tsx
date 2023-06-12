import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import ROUTES from 'constants/routes';
import useUserNotificationsQuery from 'queries/user/useUserNotificationsQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { buildHref } from 'utils/routes';

const Notification: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const notificationsQuery = useUserNotificationsQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const notifications = useMemo(() => {
        if (notificationsQuery.isSuccess && notificationsQuery.data) {
            return notificationsQuery.data;
        }
        return 0;
    }, [notificationsQuery]);

    const hasNotifications = notifications > 0;

    return isWalletConnected ? (
        <SPAAnchor href={buildHref(ROUTES.Options.Profile)}>
            <Wrapper hasBackground={hasNotifications}>
                {hasNotifications ? (
                    <>
                        <Bell className="icon icon--bell" />
                        <Number>{notifications}</Number>
                    </>
                ) : (
                    <Icon className={`icon icon--user-avatar`} />
                )}
            </Wrapper>
        </SPAAnchor>
    ) : (
        <></>
    );
};

const Bell = styled.i`
    color: ${(props) => props.theme.background.primary};
    font-size: 13px;
    animation: shake 1s linear infinite;
`;

const Wrapper = styled.div<{ hasBackground: boolean }>`
    position: absolute;
    top: 40px;
    right: 30px;
    width: 42px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    ${(props) => (props.hasBackground ? `background: ${props.theme.background.quaternary};` : '')}
    border-radius: 24px;

    @media (max-width: 1024px) {
        top: 20px;
    }

    @media (max-width: 500px) {
        right: 10px;
        top: 20px;
    }
`;

const Number = styled.span`
    color: ${(props) => props.theme.background.primary};
    font-size: 13px;
    font-weight: 600;
`;

const Icon = styled.i`
    font-size: 22px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default Notification;
