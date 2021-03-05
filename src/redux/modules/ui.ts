import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    isWalletPopupVisible: boolean;
    synthsCategoryFilter: string | null;
};

const initialState: UISliceState = {
    isWalletPopupVisible: false,
    synthsCategoryFilter: null,
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
        setSynthsCategoryFilter: (state, action: PayloadAction<{ category: string | null }>) => {
            state.synthsCategoryFilter = action.payload.category;
        },
    },
});

export const { toggleWalletPopup, showWalletPopup, setSynthsCategoryFilter } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const isWalletPopupVisible = (state: RootState) => getUIState(state).isWalletPopupVisible;
export const getSynthsCategoryFilter = (state: RootState) => getUIState(state).synthsCategoryFilter;

export default uiSlice.reducer;
