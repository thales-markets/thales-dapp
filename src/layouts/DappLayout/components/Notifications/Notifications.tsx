import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import Tooltip from 'components/Tooltip';
import ROUTES from 'constants/routes';
import { millisecondsToSeconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import useUserActiveChainedSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveChainedSpeedMarketsDataQuery';
import useUserActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useUserActiveSpeedMarketsDataQuery';
import usePythPriceQueries from 'queries/prices/usePythPriceQueries';
import useUserNotificationsQuery from 'queries/user/useUserNotificationsQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { isOnlySpeedMarketsSupported } from 'utils/network';
import { getPriceId } from 'utils/pyth';
import { buildHref } from 'utils/routes';

const Notifications: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const isNetworkSupported = networkId !== Network.Mainnet && !isOnlySpeedMarketsSupported(networkId);

    const notificationsQuery = useUserNotificationsQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && isNetworkSupported,
    });

    const notifications = useMemo(() => {
        if (notificationsQuery.isSuccess && notificationsQuery.data) {
            return notificationsQuery.data;
        }
        return 0;
    }, [notificationsQuery]);

    const userActiveSpeedMarketsDataQuery = useUserActiveSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const speedMarketsNotifications = useMemo(() => {
        if (userActiveSpeedMarketsDataQuery.isSuccess && userActiveSpeedMarketsDataQuery.data) {
            return userActiveSpeedMarketsDataQuery.data.filter((marketData) => marketData.claimable).length;
        }
        return 0;
    }, [userActiveSpeedMarketsDataQuery]);

    const userActiveChainedSpeedMarketsDataQuery = useUserActiveChainedSpeedMarketsDataQuery(networkId, walletAddress, {
        enabled: isAppReady && isWalletConnected && isNetworkSupported,
    });
    const userActiveChainedSpeedMarketsData = useMemo(
        () =>
            userActiveChainedSpeedMarketsDataQuery.isSuccess && userActiveChainedSpeedMarketsDataQuery.data
                ? userActiveChainedSpeedMarketsDataQuery.data
                : [],
        [userActiveChainedSpeedMarketsDataQuery]
    );

    // Prepare active chained speed markets that become matured to fetch Pyth prices
    const maturedChainedMarkets = userActiveChainedSpeedMarketsData
        .filter((marketData) => marketData.isMatured)
        .map((marketData) => {
            const strikeTimes = marketData.strikeTimes.map((strikeTime) => millisecondsToSeconds(strikeTime));
            return {
                ...marketData,
                strikeTimes,
                pythPriceId: getPriceId(networkId, marketData.currencyKey),
            };
        });

    const priceRequests = maturedChainedMarkets
        .map((data) =>
            data.strikeTimes.map((strikeTime) => ({
                priceId: data.pythPriceId,
                publishTime: strikeTime,
                market: data.address,
            }))
        )
        .flat();
    const pythPricesQueries = usePythPriceQueries(networkId, priceRequests, { enabled: priceRequests.length > 0 });
    const pythPricesWithMarket = priceRequests.map((request, i) => ({
        market: request.market,
        price: pythPricesQueries[i]?.data || 0,
    }));

    // Based on Pyth prices determine if chained position is claimable
    const chainedSpeedMarketsNotifications = maturedChainedMarkets
        .map((marketData) => {
            const finalPrices = marketData.strikeTimes.map(
                (_, i) => pythPricesWithMarket.filter((pythPrice) => pythPrice.market === marketData.address)[i].price
            );
            const strikePrices = marketData.strikePrices.map((strikePrice, i) =>
                i > 0 ? finalPrices[i - 1] : strikePrice
            );
            const userWonStatuses = marketData.sides.map((side, i) =>
                finalPrices[i] > 0 && strikePrices[i] > 0
                    ? (side === Positions.UP && finalPrices[i] > strikePrices[i]) ||
                      (side === Positions.DOWN && finalPrices[i] < strikePrices[i])
                    : undefined
            );
            const claimable = userWonStatuses.every((status) => status);

            return { ...marketData, finalPrices, claimable };
        })
        .filter((marketData) => marketData.claimable).length;

    const totalNotifications = notifications + speedMarketsNotifications + chainedSpeedMarketsNotifications;

    const hasNotifications = totalNotifications > 0;

    return isWalletConnected ? (
        <SPAAnchor href={buildHref(ROUTES.Options.Profile)}>
            <Container>
                {hasNotifications ? (
                    <Tooltip overlay={t('common.header.notification.tooltip', { count: totalNotifications })}>
                        <Wrapper>
                            <Bell className="icon icon--bell" />
                            <Number>{totalNotifications}</Number>
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
    gap: 2px;
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
