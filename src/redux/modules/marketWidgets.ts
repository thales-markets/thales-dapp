import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { MarketWidgetDefaultLayoutMap, MarketWidgetKey } from 'constants/ui';
import { Layout } from 'react-grid-layout';
import localStore from 'utils/localStore';
import { RootState } from '../rootReducer';

const sliceName = 'marketWidgets';

const getDefaultLayout = () => {
    return Object.values(MarketWidgetKey).map(
        (widgetKey: string) => MarketWidgetDefaultLayoutMap[widgetKey as MarketWidgetKey]
    );
};

const getInitialFullLayout = () => {
    const localStoreFullLayout: any = localStore.get(LOCAL_STORAGE_KEYS.MARKET_WIDGET_FULL_LAYOUT);

    if (localStoreFullLayout) {
        Object.values(MarketWidgetKey).forEach((widgetKey: string) => {
            const layoutItemIndex = localStoreFullLayout.findIndex((item: any) => item.i === widgetKey);
            if (layoutItemIndex == -1) {
                localStoreFullLayout.push(MarketWidgetDefaultLayoutMap[widgetKey as MarketWidgetKey]);
            }
        });

        localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_FULL_LAYOUT, localStoreFullLayout);
        return localStoreFullLayout;
    }

    return getDefaultLayout();
};

const getInitialVisibilityMap = () => {
    const localStoreVisibilityMap: any = localStore.get(LOCAL_STORAGE_KEYS.MARKET_WIDGET_VISIBILITY_MAP);

    if (localStoreVisibilityMap) {
        Object.values(MarketWidgetKey).forEach((widgetKey: string) => {
            const visibilityMapItem = localStoreVisibilityMap[widgetKey];
            if (visibilityMapItem === undefined) {
                localStoreVisibilityMap[widgetKey] = true;
            }
        });

        localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_VISIBILITY_MAP, localStoreVisibilityMap);
        return localStoreVisibilityMap;
    }

    return defaultMarketWidgetVisibility;
};

const getInitialAmmSelected = () => {
    const localStoreAmmSelected: any = localStore.get(LOCAL_STORAGE_KEYS.MARKET_WIDGET_AMM_SELECTED);
    return localStoreAmmSelected === undefined ? true : localStoreAmmSelected;
};

type UISliceState = {
    visibilityMap: Record<MarketWidgetKey, boolean>;
    currentLayout: Layout[];
    fullLayout: Layout[];
    ammSelected: boolean;
};

const defaultMarketWidgetVisibility: Record<MarketWidgetKey, boolean> = {
    [MarketWidgetKey.AMM]: true,
    [MarketWidgetKey.MATURITY_PHASE]: true,
    [MarketWidgetKey.TRADE]: true,
    [MarketWidgetKey.ORDERBOOK]: true,
    [MarketWidgetKey.CHART_TRADING_VIEW]: true,
    [MarketWidgetKey.CUSTOM_MARKET_RESULTS]: true,
    [MarketWidgetKey.CHART_OPTIONS_PRICE]: true,
    [MarketWidgetKey.RECENT_TRANSACTIONS]: true,
    [MarketWidgetKey.YOUR_TRANSACTIONS]: true,
};

const defaultState: UISliceState = {
    visibilityMap: defaultMarketWidgetVisibility,
    currentLayout: [],
    fullLayout: getDefaultLayout(),
    ammSelected: true,
};

const initialState: UISliceState = {
    visibilityMap: getInitialVisibilityMap(),
    currentLayout: localStore.get(LOCAL_STORAGE_KEYS.MARKET_WIDGET_CURRENT_LAYOUT) || [],
    fullLayout: getInitialFullLayout(),
    ammSelected: getInitialAmmSelected(),
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setMarketWidgetVisibility: (
            state,
            action: PayloadAction<{
                marketWidget: MarketWidgetKey;
                isVisible: boolean;
            }>
        ) => {
            const { marketWidget, isVisible } = action.payload;

            if (isVisible) {
                const layoutItem = state.fullLayout.find((item) => item.i === marketWidget);
                if (layoutItem) {
                    state.currentLayout = [...state.currentLayout, layoutItem];
                }
            }

            state.visibilityMap = {
                ...state.visibilityMap,
                [marketWidget]: isVisible,
            };
            saveWidgetsToLS(state);
        },
        resetMarketWidgetVisibilityMap: (state) => {
            saveWidgetsToLS(state);
            return defaultState;
        },
        setMarketWidgetLayout: (state: UISliceState, action: PayloadAction<Layout[]>) => {
            const newLayout = action.payload;
            newLayout.map((newLayoutItem: Layout) => {
                const marketWidget = newLayoutItem.i as MarketWidgetKey;
                const layoutItemIndex = state.fullLayout.findIndex((item) => item.i === marketWidget);
                if (layoutItemIndex > -1) {
                    state.fullLayout[layoutItemIndex] = newLayoutItem;
                }
            });

            state.currentLayout = newLayout;
            saveWidgetsToLS(state);
        },
        setAmmSelected: (state: UISliceState, action: PayloadAction<boolean>) => {
            state.ammSelected = action.payload;
            if (action.payload) {
                const layoutItem = state.fullLayout.find((item) => item.i === MarketWidgetKey.AMM);
                if (layoutItem) {
                    state.currentLayout = [...state.currentLayout, layoutItem];
                } else {
                    state.currentLayout = [...state.currentLayout, MarketWidgetDefaultLayoutMap[MarketWidgetKey.AMM]];
                }

                state.visibilityMap = {
                    ...state.visibilityMap,
                    [MarketWidgetKey.AMM]: true,
                };
            }
            saveWidgetsToLS(state);
        },
    },
});

const saveWidgetsToLS = (state: UISliceState) => {
    localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_VISIBILITY_MAP, state.visibilityMap);
    localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_CURRENT_LAYOUT, state.currentLayout);
    localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_FULL_LAYOUT, state.fullLayout);
    localStore.set(LOCAL_STORAGE_KEYS.MARKET_WIDGET_AMM_SELECTED, state.ammSelected);
};

export const {
    setMarketWidgetVisibility,
    resetMarketWidgetVisibilityMap,
    setMarketWidgetLayout,
    setAmmSelected,
} = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const getVisibilityMap = (state: RootState) => getUIState(state).visibilityMap;
export const getCurrentLayout = (state: RootState) => getUIState(state).currentLayout;
export const getFullLayout = (state: RootState) => getUIState(state).fullLayout;
export const getAmmSelected = (state: RootState) => getUIState(state).ammSelected;

export default uiSlice.reducer;
