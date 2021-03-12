import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    walletPopupIsVisible: boolean;
    hideSmallValueAssets: boolean;
};

const initialState: UISliceState = {
    walletPopupIsVisible: false,
    hideSmallValueAssets: false,
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
        toggleHideSmallValueAssets: (state) => {
            state.hideSmallValueAssets = !state.hideSmallValueAssets;
        },
    },
});

export const { toggleWalletPopup, showWalletPopup } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const walletPopupIsVisible = (state: RootState) => getUIState(state).walletPopupIsVisible;
export const getHideSmallValueAssets = (state: RootState) => getUIState(state).hideSmallValueAssets;

export default uiSlice.reducer;
