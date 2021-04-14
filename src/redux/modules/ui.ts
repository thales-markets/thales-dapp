import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketWidgetKey } from 'constants/ui';
import { Layout } from 'react-grid-layout';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    theme: string;
    marketWidgetVisibilityMap: Record<MarketWidgetKey, boolean>;
    marketWidgetLayout: Layout[];
};

const initalMarketWidgetVisibility: Record<MarketWidgetKey, boolean> = {
    [MarketWidgetKey.BIDDING_PHASE]: true,
    [MarketWidgetKey.TRADING_PHASE]: true,
    [MarketWidgetKey.MATURITY_PHASE]: true,
    [MarketWidgetKey.TRADE]: true,
    [MarketWidgetKey.ORDERBOOK]: true,
    [MarketWidgetKey.CHART]: true,
    [MarketWidgetKey.RECENT_TRANSACTIONS]: true,
    [MarketWidgetKey.YOUR_TRANSACTIONS]: true,
};

const initialState: UISliceState = {
    theme: '',
    marketWidgetVisibilityMap: initalMarketWidgetVisibility,
    marketWidgetLayout: [],
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
        setMarketWidgetVisibility: (
            state,
            action: PayloadAction<{
                marketWidget: MarketWidgetKey;
                isVisible: boolean;
            }>
        ) => {
            const { marketWidget, isVisible } = action.payload;

            state.marketWidgetVisibilityMap = {
                ...state.marketWidgetVisibilityMap,
                [marketWidget]: isVisible,
            };
        },
        resetMarketWidgetVisibilityMap: (state) => {
            state.marketWidgetVisibilityMap = initalMarketWidgetVisibility;
            state.marketWidgetLayout = [];
        },
        setMarketWidgetLayout: (state, action: PayloadAction<Layout[]>) => {
            state.marketWidgetLayout = action.payload;
        },
    },
});

export const {
    setTheme,
    setMarketWidgetVisibility,
    resetMarketWidgetVisibilityMap,
    setMarketWidgetLayout,
} = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const getTheme = (state: RootState) => getUIState(state).theme;
export const getMarketWidgetVisibilityMap = (state: RootState) => getUIState(state).marketWidgetVisibilityMap;
export const getMarketWidgetLayout = (state: RootState) => getUIState(state).marketWidgetLayout;

export default uiSlice.reducer;
