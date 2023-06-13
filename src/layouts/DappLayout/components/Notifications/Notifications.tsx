import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import Tooltip from 'components/Tooltip';
import ROUTES from 'constants/routes';
import useUserNotificationsQuery from 'queries/user/useUserNotificationsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { buildHref } from 'utils/routes';

const Notifications: React.FC = () => {
    const { t } = useTranslation();
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
            <Container>
                {hasNotifications ? (
                    <Tooltip overlay={t('header.notification.tooltip', { count: notifications })}>
                        <Wrapper>
                            <Bell className="icon icon--bell" />
                            <Number>{notifications}</Number>
                        </Wrapper>
                    </Tooltip>
                ) : (
                    <Icon className={`icon icon--user-avatar`} />
                )}
            </Container>
        </SPAAnchor>
    ) : (
        <></>
    );
};

const Container = styled(FlexDivCentered)`
    height: 26px;
    margin-left: 10px;
`;

const Wrapper = styled(FlexDivCentered)`
    width: 42px;
    height: inherit;
    background: ${(props) => props.theme.background.quaternary};
    border-radius: 24px;
`;

const Number = styled.span`
    color: ${(props) => props.theme.background.primary};
    font-size: 13px;
    font-weight: 600;
`;

const Bell = styled.i`
    color: ${(props) => props.theme.background.primary};
    font-size: 13px;
    animation: shake 1s linear infinite;
`;

const Icon = styled.i`
    font-size: 22px;
    color: ${(props) => props.theme.textColor.primary};
`;

export default Notifications;
