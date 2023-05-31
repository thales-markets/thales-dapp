import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'marketWidgets';

type UISliceState = {
    isBuy: boolean;
};

const initialState: UISliceState = {
    isBuy: true,
};

const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setBuyState: (state: UISliceState, action: PayloadAction<boolean>) => {
            state.isBuy = action.payload;
        },
    },
});

export const { setBuyState } = uiSlice.actions;

const getUIState = (state: RootState) => state[sliceName];
export const getIsBuyState = (state: RootState) => getUIState(state).isBuy;

export default uiSlice.reducer;
