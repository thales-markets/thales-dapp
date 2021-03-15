import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { ReactComponent as PencilIcon } from 'assets/images/pencil.svg';
import { ReactComponent as PersonIcon } from 'assets/images/person.svg';
import { ReactComponent as NoResultsIcon } from 'assets/images/no-results.svg';
import MarketsTable from '../MarketsTable';
import ROUTES from 'constants/routes';
import { OptionsMarkets } from 'types/options';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getWalletAddress, getIsWalletConnected } from 'redux/modules/wallet';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import { PHASES } from 'constants/options';
import { navigateTo } from 'utils/routes';
import { Button, Container, Input } from 'semantic-ui-react';
import useBinaryOptionsUserBidsMarketsQuery from 'queries/options/useBinaryOptionsUserBidsMarketsQuery';
import { getIsAppReady } from 'redux/modules/app';

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

const ExploreMarkets: React.FC<ExploreMarketsProps> = ({ optionsMarkets }) => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const { t } = useTranslation();
    const [assetSearch, setAssetSearch] = useState<string>('');
    const [filter, setFilter] = useState<Filter>(defaultFilter);

    const userBidsMarketsQuery = useBinaryOptionsUserBidsMarketsQuery(walletAddress, {
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

    const userFilters: Array<{ filterName: Filter['name']; icon: JSX.Element }> = [
        {
            filterName: 'user-bids',
            icon: <PersonIcon width="14px" height="14px" />,
        },
        {
            filterName: 'creator',
            icon: <PencilIcon width="14px" height="14px" />,
        },
    ];

    const isPhaseFilter = filter.name === 'phase';
    const isCreatorFilter = filter.name === 'creator';
    const isUserBidsFilter = filter.name === 'user-bids';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button
                        toggle
                        basic
                        active={isPhaseFilter && filter.value == null}
                        onClick={() => setFilter({ name: 'phase' })}
                    >
                        {t('common.filters.all')}
                    </Button>
                    {PHASES.map((phase) => (
                        <Button
                            toggle
                            basic
                            active={isPhaseFilter && filter.value === phase}
                            onClick={() => setFilter({ name: 'phase', value: phase })}
                            key={phase}
                        >
                            {t(`options.phases.${phase}`)}
                        </Button>
                    ))}
                </div>
                <div>
                    {userFilters.map(({ filterName, icon }) => {
                        const isActive = filter.name === filterName;

                        return (
                            <Tooltip
                                key={filterName}
                                title={
                                    <span>
                                        {!isWalletConnected
                                            ? t(
                                                  `options.home.explore-markets.table.filters.${filterName}.tooltip-connected`
                                              )
                                            : t(
                                                  `options.home.explore-markets.table.filters.${filterName}.tooltip-not-connected`
                                              )}
                                    </span>
                                }
                                placement="top"
                                arrow={true}
                            >
                                <Button
                                    toggle
                                    basic
                                    onClick={
                                        isWalletConnected
                                            ? () => {
                                                  if (isActive) {
                                                      // toggle off
                                                      setDefaultFilter();
                                                  } else {
                                                      // toggle on
                                                      setFilter({
                                                          name: filterName,
                                                      });
                                                  }
                                              }
                                            : undefined
                                    }
                                    active={isActive}
                                >
                                    {icon}
                                </Button>
                            </Tooltip>
                        );
                    })}
                    <Input onChange={(e) => setAssetSearch(e.target.value)} value={assetSearch} icon="search" />
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
                                            <Button primary onClick={() => navigateTo(ROUTES.Options.CreateMarket)}>
                                                {t('options.home.market-creation.create-market-button-label')}
                                            </Button>
                                            <div>{t('common.or')}</div>
                                        </div>
                                    </>
                                )}
                                {isUserBidsFilter && (
                                    <div>{t('options.home.explore-markets.table.filters.user-bids.no-results')}</div>
                                )}
                                <Button primary basic onClick={setDefaultFilter}>
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
