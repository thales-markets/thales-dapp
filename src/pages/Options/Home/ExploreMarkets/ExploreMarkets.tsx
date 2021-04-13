import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MarketsTable from '../MarketsTable';
import { OptionsMarkets } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getWalletAddress, getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import useBinaryOptionsUserBidsMarketsQuery from 'queries/options/useBinaryOptionsUserBidsMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';
import { Button, FlexDivCentered } from 'theme/common';
import styled from 'styled-components';
import myBids from 'assets/images/my-bids.svg';
import myMarkets from 'assets/images/my-markets.svg';
import myWatchlist from 'assets/images/my-watchlist.svg';
import recentlyAdded from 'assets/images/recently-added.svg';
import UserFilter from './UserFilters';
import SearchMarket from '../SearchMarket';

type ExploreMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

enum PhaseFilterEnum {
    all = 'all',
    bidding = 'bidding',
    trading = 'trading',
    maturity = 'maturity',
    expiry = 'expiry',
}

enum UserFilterEnum {
    All = 'All',
    MyBids = 'My Bids',
    MyMarkets = 'My Markets',
    MyWatchlist = 'My Watchlist',
    Recent = 'Recently Added',
}

const FilterButton = styled(Button)`
    width: 110px;
    height: 40px;
    margin: 24px 10px;
    background: transparent;
    border: 1px solid #04045a;
    border-radius: 32px;
    font-weight: bold;
    font-size: 13px;
    line-height: 13px;
    text-align: center;
    letter-spacing: 0.4px;
    text-transform: capitalize !important;
    color: #f6f6fe;
    &.selected {
        background: #44e1e2;
    }
`;

const ExploreMarkets: React.FC<ExploreMarketsProps> = ({ optionsMarkets }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [phaseFilter, setPhaseFilter] = useState<PhaseFilterEnum>(PhaseFilterEnum.all);
    const [userFilter, setUserFilter] = useState<UserFilterEnum>(UserFilterEnum.All);

    const userBidsMarketsQuery = useBinaryOptionsUserBidsMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && userFilter === UserFilterEnum.MyBids,
    });

    const filteredOptionsMarkets = useMemo(() => {
        let filteredMarkets = optionsMarkets;
        switch (userFilter) {
            case UserFilterEnum.MyBids:
                if (isWalletConnected) {
                    filteredMarkets =
                        userBidsMarketsQuery.isSuccess && Array.isArray(userBidsMarketsQuery.data)
                            ? filteredMarkets.filter(({ address }) => userBidsMarketsQuery.data.includes(address))
                            : [];
                }

                break;
            case UserFilterEnum.MyMarkets:
                if (isWalletConnected) {
                    filteredMarkets = filteredMarkets.filter(
                        ({ creator }) => creator.toLowerCase() === walletAddress.toLowerCase()
                    );
                }

                break;
            case UserFilterEnum.MyWatchlist:
                break;
            case UserFilterEnum.Recent:
                break;
        }

        if (phaseFilter !== PhaseFilterEnum.all) {
            filteredMarkets = filteredMarkets.filter((market) => {
                return market.phase === phaseFilter;
            });
        }
        return filteredMarkets;
    }, [
        optionsMarkets,
        userFilter,
        phaseFilter,
        isWalletConnected,
        walletAddress,
        userBidsMarketsQuery.data,
        userBidsMarketsQuery.isSuccess,
    ]);

    const onClickUserFilter = (filter: UserFilterEnum) => {
        setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
        return;
    };

    const getImage = (filter: UserFilterEnum) => {
        switch (filter) {
            case UserFilterEnum.MyBids:
                return myBids;

            case UserFilterEnum.MyMarkets:
                return myMarkets;

            case UserFilterEnum.MyWatchlist:
                return myWatchlist;
            case UserFilterEnum.Recent:
                return recentlyAdded;
        }
    };

    const getColor = (filter: UserFilterEnum) => {
        switch (filter) {
            case UserFilterEnum.MyBids:
                return 'linear-gradient(144.68deg, #86E1A0 9.9%, #4FBF67 84.58%)';
            case UserFilterEnum.MyMarkets:
                return 'linear-gradient(135deg, #FFA051 0%, #FF6628 100%)';
            case UserFilterEnum.MyWatchlist:
                return 'linear-gradient(135deg, #FF8FD8 0%, #4E47E2 100%)';
            case UserFilterEnum.Recent:
                return 'linear-gradient(146.29deg, #B2DEEF 14.84%, #3EDDDD 92.53%)';
        }
    };

    return (
        <div style={{ width: '100%', padding: '50px 120px' }}>
            <FlexDivCentered>
                {Object.keys(UserFilterEnum)
                    .filter(
                        (key) =>
                            isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])) &&
                            key !== UserFilterEnum.All
                    )
                    .map((key) => (
                        <UserFilter
                            className={
                                userFilter === UserFilterEnum[key as keyof typeof UserFilterEnum] ? 'selected' : ''
                            }
                            onClick={onClickUserFilter.bind(this, UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            key={key}
                            color={getColor(UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            img={getImage(UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            text={UserFilterEnum[key as keyof typeof UserFilterEnum]}
                        ></UserFilter>
                    ))}
            </FlexDivCentered>

            <SearchMarket></SearchMarket>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    {Object.keys(PhaseFilterEnum)
                        .filter((key) => isNaN(Number(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])))
                        .map((key) => (
                            <FilterButton
                                className={
                                    phaseFilter === PhaseFilterEnum[key as keyof typeof PhaseFilterEnum]
                                        ? 'selected'
                                        : ''
                                }
                                onClick={() => setPhaseFilter(PhaseFilterEnum[key as keyof typeof PhaseFilterEnum])}
                                key={key}
                            >
                                {t(`options.phases.${key}`)}
                            </FilterButton>
                        ))}
                </div>
            </div>

            <MarketsTable optionsMarkets={filteredOptionsMarkets} isLoading={userBidsMarketsQuery.isLoading} />
        </div>
    );
};

export default ExploreMarkets;
