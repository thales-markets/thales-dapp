import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketWidgetsSliceState, RootState } from 'types/ui';

const sliceName = 'marketWidgets';

const initialState: MarketWidgetsSliceState = {
    isBuy: true,
};

const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setIsBuy: (state: MarketWidgetsSliceState, action: PayloadAction<boolean>) => {
            state.isBuy = action.payload;
        },
    },
});

export const { setIsBuy } = uiSlice.actions;

const getUIState = (state: RootState) => state[sliceName];
export const getIsBuy = (state: RootState) => getUIState(state).isBuy;

export default uiSlice.reducer;
