import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const sliceName = 'ui';

export enum Theme {
    Light,
    Dark,
}

type UISliceState = {
    theme: number;
};

const initialState: UISliceState = {
    theme: 1,
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<number>) => {
            state.theme = action.payload;
            cookies.set('home-theme', action.payload);
        },
    },
});

export const { setTheme } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const getTheme = (state: RootState) => getUIState(state).theme;
export default uiSlice.reducer;
