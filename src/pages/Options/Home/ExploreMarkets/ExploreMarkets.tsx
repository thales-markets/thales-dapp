import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as NoResultsIcon } from 'assets/images/no-results.svg';
import MarketsTable from '../MarketsTable';
import ROUTES from 'constants/routes';
import { OptionsMarkets } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getWalletAddress, getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import { PHASES } from 'constants/options';
import { navigateTo } from 'utils/routes';
import { Container } from 'semantic-ui-react';
import useBinaryOptionsUserBidsMarketsQuery from 'queries/options/useBinaryOptionsUserBidsMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';
import { Button } from 'theme/common';
import MarketsFilters from './MarketFilters';
import styled from 'styled-components';

type ExploreMarketsProps = {
    optionsMarkets: OptionsMarkets;
};

type Filter = {
    name: 'creator' | 'user-bids' | 'phase';
    value?: string;
};

const defaultFilter: Filter = {
    name: 'phase',
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
    const [assetSearch, setAssetSearch] = useState<string>('');
    const [filter, setFilter] = useState<Filter>(defaultFilter);

    const userBidsMarketsQuery = useBinaryOptionsUserBidsMarketsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && filter.name === 'user-bids',
    });

    const filteredOptionsMarkets = useMemo(() => {
        if (filter.name === 'creator' && isWalletConnected) {
            return optionsMarkets.filter(({ creator }) => creator.toLowerCase() === walletAddress.toLowerCase());
        } else if (filter.name === 'user-bids' && isWalletConnected) {
            return userBidsMarketsQuery.isSuccess && Array.isArray(userBidsMarketsQuery.data)
                ? optionsMarkets.filter(({ address }) => userBidsMarketsQuery.data.includes(address))
                : [];
        }
        // phase filter
        return filter.value == null ? optionsMarkets : optionsMarkets.filter(({ phase }) => phase === filter.value);
    }, [
        optionsMarkets,
        filter,
        isWalletConnected,
        walletAddress,
        userBidsMarketsQuery.data,
        userBidsMarketsQuery.isSuccess,
    ]);

    const searchFilteredOptionsMarkets = useDebouncedMemo(
        () =>
            assetSearch
                ? filteredOptionsMarkets.filter(({ asset }) => asset.toLowerCase().includes(assetSearch.toLowerCase()))
                : filteredOptionsMarkets,
        [filteredOptionsMarkets, assetSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const setDefaultFilter = useCallback(() => setFilter(defaultFilter), []);

    useEffect(() => {
        setAssetSearch('');
    }, [filter, setAssetSearch]);

    useEffect(() => {
        if (!isWalletConnected) {
            if (filter.name !== 'phase') {
                setDefaultFilter();
            }
        }
    }, [isWalletConnected, setDefaultFilter, filter]);

    // const userFilters: Array<{ filterName: Filter['name']; icon: JSX.Element }> = [
    //     {
    //         filterName: 'user-bids',
    //         icon: <PersonIcon width="14px" height="14px" />,
    //     },
    //     {
    //         filterName: 'creator',
    //         icon: <PencilIcon width="14px" height="14px" />,
    //     },
    // ];

    const isPhaseFilter = filter.name === 'phase';
    const isCreatorFilter = filter.name === 'creator';
    const isUserBidsFilter = filter.name === 'user-bids';

    return (
        <div style={{ width: '100%', padding: '400px 120px' }}>
            <MarketsFilters></MarketsFilters>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '100px' }}>
                <div>
                    <FilterButton
                        className={isPhaseFilter && filter.value == null ? 'selected' : ''}
                        onClick={() => setFilter({ name: 'phase' })}
                    >
                        {t('common.filters.all')}
                    </FilterButton>
                    {PHASES.map((phase) => (
                        <FilterButton
                            className={isPhaseFilter && filter.value == phase ? 'selected' : ''}
                            onClick={() => setFilter({ name: 'phase', value: phase })}
                            key={phase}
                        >
                            {t(`options.phases.${phase}`)}
                        </FilterButton>
                    ))}
                </div>
            </div>

            <MarketsTable
                optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : filteredOptionsMarkets}
                isLoading={userBidsMarketsQuery.isLoading}
                noResultsMessage={
                    (assetSearch && searchFilteredOptionsMarkets.length === 0) ||
                    filteredOptionsMarkets.length === 0 ? (
                        <Container fluid style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                <NoResultsIcon />
                                {isPhaseFilter && (
                                    <div>{t('options.home.explore-markets.table.filters.markets.no-results')}</div>
                                )}
                                {isCreatorFilter && (
                                    <>
                                        <div>{t('options.home.explore-markets.table.filters.creator.no-results')}</div>
                                        <div>
                                            <Button onClick={() => navigateTo(ROUTES.Options.CreateMarket)}>
                                                {t('options.home.market-creation.create-market-button-label')}
                                            </Button>
                                            <div>{t('common.or')}</div>
                                        </div>
                                    </>
                                )}
                                {isUserBidsFilter && (
                                    <div>{t('options.home.explore-markets.table.filters.user-bids.no-results')}</div>
                                )}
                                <Button onClick={setDefaultFilter}>
                                    {isUserBidsFilter
                                        ? t('options.home.explore-markets.table.view-all-open-markets')
                                        : t('options.home.explore-markets.table.view-all-markets')}
                                </Button>
                            </div>
                        </Container>
                    ) : undefined
                }
            />
        </div>
    );
};

export default ExploreMarkets;
