import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    isWalletPopupVisible: boolean;
};

const initialState: UISliceState = {
    isWalletPopupVisible: false,
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        toggleWalletPopup: (state, action: PayloadAction<boolean>) => {
            state.isWalletPopupVisible = action.payload;
        },
        showWalletPopup: (state) => {
            state.isWalletPopupVisible = true;
        },
    },
});

export const { toggleWalletPopup, showWalletPopup } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const isWalletPopupVisible = (state: RootState) => getUIState(state).isWalletPopupVisible;

export default uiSlice.reducer;
