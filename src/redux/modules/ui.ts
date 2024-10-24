import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { localStore } from 'thales-utils';
import { RootState, UISliceState } from 'types/ui';

const sliceName = 'ui';

const getDefaultIsDeprecatedCurrency = (): boolean => {
    const isDeprecatedCurrency = localStore.get(LOCAL_STORAGE_KEYS.IS_DEPRECATED_CURRENCY);
    return (isDeprecatedCurrency !== undefined ? isDeprecatedCurrency : false) as boolean;
};

const initialState: UISliceState = {
    isMobile: false,
    showTour: false,
    isDeprecatedCurrency: getDefaultIsDeprecatedCurrency(),
};

const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
        setShowTour: (state, action: PayloadAction<boolean>) => {
            state.showTour = action.payload;
            localStore.set(LOCAL_STORAGE_KEYS.NEW_USER_TOUR, 'false');
        },
        setIsDeprecatedCurrency: (state, action: PayloadAction<boolean>) => {
            state.isDeprecatedCurrency = action.payload;
            localStore.set(LOCAL_STORAGE_KEYS.IS_DEPRECATED_CURRENCY, action.payload);
        },
    },
});

const getUIState = (state: RootState) => state[sliceName];
export const getIsMobile = (state: RootState) => getUIState(state).isMobile;
export const getShowTour = (state: RootState) => getUIState(state).showTour;
export const getIsDeprecatedCurrency = (state: RootState) => getUIState(state).isDeprecatedCurrency;

export const { setIsMobile, setShowTour, setIsDeprecatedCurrency } = uiSlice.actions;

export default uiSlice.reducer;
