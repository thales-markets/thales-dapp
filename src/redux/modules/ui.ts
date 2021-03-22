import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    walletPopupIsVisible: boolean;
};

const initialState: UISliceState = {
    walletPopupIsVisible: false,
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        toggleWalletPopup: (state, action: PayloadAction<boolean>) => {
            state.walletPopupIsVisible = action.payload;
        },
        showWalletPopup: (state) => {
            state.walletPopupIsVisible = true;
        },
    },
});

export const { toggleWalletPopup, showWalletPopup } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const walletPopupIsVisible = (state: RootState) => getUIState(state).walletPopupIsVisible;

export default uiSlice.reducer;
