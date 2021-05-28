import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MarketsTable from '../MarketsTable';
import { OptionsMarkets } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getWalletAddress, getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { Button, FlexDiv, FlexDivCentered, FlexDivColumn, Text } from 'theme/common';
import styled from 'styled-components';
import myMarkets from 'assets/images/my-markets.svg';
import myWatchlist from 'assets/images/my-watchlist.svg';
import recentlyAdded from 'assets/images/recently-added.svg';
import UserFilter from './UserFilters';
import SearchMarket from '../SearchMarket';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import onboardConnector from 'utils/onboardConnector';
import useUserWatchlistedMarketsQuery from 'queries/watchlist/useUserWatchlistedMarketsQuery';

type ExploreMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

export enum PhaseFilterEnum {
    all = 'all',
    trading = 'trading',
    maturity = 'maturity',
    expiry = 'expiry',
}

enum UserFilterEnum {
    All = 'All',
    MyMarkets = 'My Markets',
    MyWatchlist = 'My Watchlist',
    Recent = 'Recently Added',
}

const ExploreMarkets: React.FC<ExploreMarketsProps> = ({ optionsMarkets }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const { t } = useTranslation();
    const [phaseFilter, setPhaseFilter] = useState<PhaseFilterEnum>(PhaseFilterEnum.all);
    const [userFilter, setUserFilter] = useState<UserFilterEnum>(UserFilterEnum.All);
    const [assetSearch, setAssetSearch] = useState<string>('');

    const watchlistedMarketsQuery = useUserWatchlistedMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const watchlistedMarketsData = watchlistedMarketsQuery.data ? watchlistedMarketsQuery.data.data : [];
    const [watchlistedMarkets, setWatchlistedMarkets] = useState<string[]>(watchlistedMarketsData);

    const handleWatchlistedMarketsChange = (newWatchlist: string[]) => {
        setWatchlistedMarkets(newWatchlist);
    };

    const filteredOptionsMarkets = useMemo(() => {
        let filteredMarkets = optionsMarkets;
        switch (userFilter) {
            case UserFilterEnum.MyMarkets:
                if (isWalletConnected) {
                    filteredMarkets = filteredMarkets.filter(
                        ({ creator }) => creator.toLowerCase() === walletAddress.toLowerCase()
                    );
                }
                break;
            case UserFilterEnum.MyWatchlist:
                if (isWalletConnected) {
                    filteredMarkets = filteredMarkets.filter(({ address }) => watchlistedMarkets?.includes(address));
                }
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
    }, [optionsMarkets, userFilter, phaseFilter, isWalletConnected, walletAddress, watchlistedMarkets, assetSearch]);

    const searchFilteredOptionsMarkets = useDebouncedMemo(
        () =>
            assetSearch
                ? filteredOptionsMarkets.filter(({ asset }) => asset.toLowerCase().includes(assetSearch.toLowerCase()))
                : filteredOptionsMarkets,
        [filteredOptionsMarkets, assetSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const onClickUserFilter = (filter: UserFilterEnum) => {
        setUserFilter(userFilter === filter ? UserFilterEnum.All : filter);
        return;
    };

    const getImage = (filter: UserFilterEnum) => {
        switch (filter) {
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
            case UserFilterEnum.MyMarkets:
                return 'linear-gradient(135deg, #FFA051 0%, #FF6628 100%)';
            case UserFilterEnum.MyWatchlist:
                return 'linear-gradient(135deg, #FF8FD8 0%, #4E47E2 100%)';
            case UserFilterEnum.Recent:
                return 'linear-gradient(146.29deg, #B2DEEF 14.84%, #3EDDDD 92.53%)';
        }
    };

    const resetFilters = () => {
        setPhaseFilter(PhaseFilterEnum.all);
        setUserFilter(UserFilterEnum.All);
    };

    return (
        <div id="explore-markets" style={{ padding: '50px 120px' }}>
            <FlexDivCentered>
                {Object.keys(UserFilterEnum)
                    .filter(
                        (key) =>
                            isNaN(Number(UserFilterEnum[key as keyof typeof UserFilterEnum])) &&
                            key !== UserFilterEnum.All
                    )
                    .map((key) => (
                        <UserFilter
                            className={`${
                                isWalletConnected && userFilter === UserFilterEnum[key as keyof typeof UserFilterEnum]
                                    ? 'selected'
                                    : ''
                            } ${!isWalletConnected ? 'disabled' : ''}`}
                            onClick={onClickUserFilter.bind(this, UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            key={key}
                            color={getColor(UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            img={getImage(UserFilterEnum[key as keyof typeof UserFilterEnum])}
                            text={UserFilterEnum[key as keyof typeof UserFilterEnum]}
                        ></UserFilter>
                    ))}
            </FlexDivCentered>

            <FlexDiv className="table-filters" style={{ justifyContent: 'space-between', marginTop: 40 }}>
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
                <SearchMarket assetSearch={assetSearch} setAssetSearch={setAssetSearch}></SearchMarket>
            </FlexDiv>

            <MarketsTable
                optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : filteredOptionsMarkets}
                watchlistedMarkets={watchlistedMarkets}
                onChange={handleWatchlistedMarketsChange}
                isLoading={false} // TODO put logic
                phase={phaseFilter}
            >
                <NoMarkets>
                    {userFilter === UserFilterEnum.All && phaseFilter !== PhaseFilterEnum.all && (
                        <>
                            <Text className="text-l bold pale-grey">No markets available.</Text>
                            <Button className="primary" onClick={setPhaseFilter.bind(this, PhaseFilterEnum.all)}>
                                View all markets
                            </Button>
                        </>
                    )}
                    {userFilter === UserFilterEnum.MyMarkets && (
                        <>
                            <Text className="text-l bold pale-grey">You haven’t created any market yet.</Text>
                            <FlexDiv style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                                <Button
                                    className="secondary"
                                    onClick={() =>
                                        isWalletConnected
                                            ? navigateTo(ROUTES.Options.CreateMarket)
                                            : onboardConnector.connectWallet()
                                    }
                                >
                                    {isWalletConnected
                                        ? t('options.home.market-creation.create-market-button-label')
                                        : t('common.wallet.connect-your-wallet')}
                                </Button>
                                <Text
                                    className="text-l bold pale-grey"
                                    style={{
                                        margin: 'auto 60px',
                                    }}
                                >
                                    or
                                </Text>
                                <Button className="primary" onClick={resetFilters}>
                                    View all markets
                                </Button>
                            </FlexDiv>
                        </>
                    )}
                </NoMarkets>
            </MarketsTable>
        </div>
    );
};

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
    letter-spacing: 0.4px;
    text-transform: capitalize !important;
    color: #f6f6fe;
    &.selected {
        background: #44e1e2;
    }
`;

const NoMarkets = styled(FlexDivColumn)`
    height: 500px;
    background: #126;
    border-radius: 20px;
    justify-content: space-evenly;
    align-items: center;
    .primary {
        align-self: center;
    }
`;

export default ExploreMarkets;
