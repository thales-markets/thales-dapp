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
        setIsBuy: (state: UISliceState, action: PayloadAction<boolean>) => {
            state.isBuy = action.payload;
        },
    },
});

export const { setIsBuy } = uiSlice.actions;

const getUIState = (state: RootState) => state[sliceName];
export const getIsBuy = (state: RootState) => getUIState(state).isBuy;

export default uiSlice.reducer;
