import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

type UISliceState = {
    isMobile: boolean;
};

const initialState: UISliceState = {
    isMobile: false,
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
    },
});

export const getUIState = (state: RootState) => state[sliceName];
export const getIsMobile = (state: RootState) => getUIState(state).isMobile;

export const { setIsMobile } = uiSlice.actions;

export default uiSlice.reducer;
