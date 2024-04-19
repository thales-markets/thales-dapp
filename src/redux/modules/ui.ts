import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { RootState, UISliceState } from 'types/ui';

const sliceName = 'ui';

const initialState: UISliceState = {
    isMobile: false,
    showTour: false,
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
            localStorage.setItem(LOCAL_STORAGE_KEYS.NEW_USER_TOUR, 'false');
        },
    },
});

const getUIState = (state: RootState) => state[sliceName];
export const getIsMobile = (state: RootState) => getUIState(state).isMobile;
export const getShowTour = (state: RootState) => getUIState(state).showTour;

export const { setIsMobile, setShowTour } = uiSlice.actions;

export default uiSlice.reducer;
