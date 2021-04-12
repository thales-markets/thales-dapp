import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/rootReducer';

export type AppSliceState = {
    isReady: boolean;
    is0xReady: boolean;
};

const initialState: AppSliceState = {
    isReady: false,
    is0xReady: false,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppReady: (state) => {
            state.isReady = true;
        },
        set0xReady: (state, action: PayloadAction<boolean>) => {
            state.is0xReady = action.payload;
        },
    },
});

export const getAppState = (state: RootState) => state.app;
export const getIsAppReady = (state: RootState) => getAppState(state).isReady;
export const getIs0xReady = (state: RootState) => getAppState(state).is0xReady;

export const { setAppReady, set0xReady } = appSlice.actions;

export default appSlice.reducer;
