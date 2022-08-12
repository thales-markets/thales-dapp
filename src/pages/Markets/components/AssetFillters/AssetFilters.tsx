import React, { lazy, Suspense, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { ReactComponent as PlusButton } from 'assets/images/asset-filters-plus.svg';
import OutsideClickHandler from 'react-outside-click-handler';
let scrolling: NodeJS.Timeout;
import { isMobile } from 'utils/device';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';

const AssetsDropdown = lazy(() => import(/* webpackChunkName: "AssetsDropdown" */ 'components/AssetsDropdown'));

const FILTERS_LENGTH = 6;

const AssetFilters: React.FC<{
    allAssets: Set<string>;
    assetFilters: string[];
    setAssetFilters: (assets: string[]) => void;
}> = ({ allAssets, assetFilters, setAssetFilters }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const selectedAssetsLocalStorageKey = LOCAL_STORAGE_KEYS.MARKET_SELECTED_ASSETS + networkId;
    const selectedAssetsLocalStorage = localStorage.getItem(selectedAssetsLocalStorageKey);

    const [selectedAssets, setSelectedAssets] = useState<string[]>(
        selectedAssetsLocalStorage ? JSON.parse(selectedAssetsLocalStorage) : []
    );
    const [assetsDropdownOpen, setAssetsDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        const selectedAssetsLocalStorage = JSON.parse(localStorage.getItem(selectedAssetsLocalStorageKey) || '[]');
        if (selectedAssetsLocalStorage.length && allAssets.size) {
            const newSelectedAssets: string[] = selectedAssetsLocalStorage.filter(
                (asset: string) => allAssets.has(asset) || (assetFilters.length ? assetFilters.includes(asset) : false)
            );
            localStorage.setItem(selectedAssetsLocalStorageKey, JSON.stringify(newSelectedAssets));
            setSelectedAssets(newSelectedAssets);
        }
    }, [allAssets, assetFilters]);

    useEffect(() => {
        const selectedAssetsLocalStorage = JSON.parse(localStorage.getItem(selectedAssetsLocalStorageKey) || '[]');
        if (!selectedAssetsLocalStorage.length) {
            setSelectedAssets([...Array.from(allAssets)].slice(0, FILTERS_LENGTH));
        }
    }, [allAssets]);

    useEffect(() => {
        const chosenAssetsLocalStorage = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEYS.MARKET_CHOSEN_ASSET + networkId) || '[]'
        );
        chosenAssetsLocalStorage.length ? setAssetFilters(chosenAssetsLocalStorage) : setAssetFilters([]);
    }, [networkId]);

    const safeSetSelectedAssets = useCallback(
        (assets) => {
            setSelectedAssets(assets);

            setAssetFilters(assetFilters.filter((filter: any) => assets.includes(filter)));
        },
        [setSelectedAssets, setAssetFilters, assetFilters]
    );

    return (
        <FilterContainer>
            <ArrowIcon
                visible={selectedAssets.length > FILTERS_LENGTH}
                onMouseOver={() => {
                    const scrollLeft = () => {
                        const filtersDiv = document.getElementById('asset-filters');
                        if (filtersDiv) {
                            filtersDiv.scrollLeft = filtersDiv.scrollLeft - 2;
                        }
                    };
                    scrolling = setInterval(scrollLeft, 10);
                }}
                onMouseOut={() => {
                    clearInterval(scrolling);
                }}
                className={'icon icon--left'}
            />
            <Filters length={allAssets.size} id="asset-filters">
                {selectedAssets.length > 0 &&
                    selectedAssets.map((value: string, index: number) => {
                        return (
                            <Item
                                key={index}
                                className={assetFilters.includes(value) ? 'active' : ''}
                                onClick={() => {
                                    if (assetFilters.includes(value)) {
                                        setAssetFilters(assetFilters.filter((asset: any) => asset !== value));
                                    } else {
                                        setAssetFilters([...assetFilters, value]);
                                    }
                                }}
                            >
                                <CurrencyIcon synthIconStyle={{ marginRight: '0px !important' }} currencyKey={value} />
                            </Item>
                        );
                    })}
            </Filters>
            <ArrowIcon
                visible={selectedAssets.length > FILTERS_LENGTH}
                onMouseOver={() => {
                    const scrollRight = () => {
                        const filtersDiv = document.getElementById('asset-filters');
                        if (filtersDiv) {
                            filtersDiv.scrollLeft = filtersDiv.scrollLeft + 2;
                        }
                    };
                    scrolling = setInterval(scrollRight, 10);
                }}
                onMouseOut={() => {
                    clearInterval(scrolling);
                }}
                className={'icon icon--right'}
            />
            <StyledPlusButton onClick={() => setAssetsDropdownOpen(!assetsDropdownOpen)} />
            {assetsDropdownOpen && (
                <Suspense fallback={<></>}>
                    <OutsideClickHandler onOutsideClick={() => setAssetsDropdownOpen(false)}>
                        <AssetsDropdownContainer>
                            {assetsDropdownOpen && (
                                <AssetsDropdown
                                    assets={[...(allAssets as any)]}
                                    localStorageKey={LOCAL_STORAGE_KEYS.MARKET_SELECTED_ASSETS}
                                    selectedAssets={selectedAssets}
                                    setSelectedAssets={safeSetSelectedAssets}
                                />
                            )}
                        </AssetsDropdownContainer>
                    </OutsideClickHandler>
                </Suspense>
            )}
        </FilterContainer>
    );
};

const FilterContainer = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const Filters = styled.div<{ length: number }>`
    width: ${(_props) =>
        (_props.length < FILTERS_LENGTH ? _props.length : FILTERS_LENGTH) * ((isMobile() ? 26 : 40) + 5)}px;
    overflow: hidden;
    display: flex;
    height: 60px;
    margin-bottom: -20px;
    @media (max-width: 768px) {
        height: 45px;
    }
`;

const Item = styled.span`
    box-sizing: content-box;
    width: 50px;
    height: 45px;
    margin-bottom: -10px;
    color: var(--primary-color);
    cursor: pointer;
    text-align: center;
    opacity: 0.5;
    padding-left: 5px;
    &.active {
        opacity: 1;
        box-shadow: 0px 4px var(--primary-filter-menu-active);
    }

    & svg {
        width: 40px !important;
        height: 40px !important;
    }

    @media (max-width: 768px) {
        width: 32px;
        & svg {
            width: 26px !important;
            height: 26px !important;
        }
    }
`;

const ArrowIcon = styled.i<{ visible?: boolean; disabled?: boolean }>`
    visibility: ${(_props) => (_props?.visible ? 'visible' : 'hidden')};
    cursor: pointer;
    font-size: 20px;
    color: ${(_props) => (_props?.disabled ? 'var(--hotmarket-arrow-disable)' : 'var(--hotmarket-arrow-enabled)')};
    pointer-events: ${(_props) => (_props?.disabled ? 'none' : 'auto')};
`;

const StyledPlusButton = styled(PlusButton)`
    padding-left: 5px;
    cursor: pointer;
`;

const AssetsDropdownContainer = styled.div`
    position: relative;
    right: 0;
    top: 0;
`;

export default AssetFilters;
