import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const sliceName = 'ui';

export enum UISize {
    Small,
    Medium,
    Large,
}

type UISliceState = {
    theme: number;
    size: UISize;
};

const initialUISize = () => {
    const width = window.innerWidth;
    if (width <= 568) {
        return UISize.Small;
    }
    if (width <= 1250) {
        return UISize.Medium;
    }
    return UISize.Large;
};

const initialState: UISliceState = {
    theme: 1,
    size: initialUISize(),
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

export const getUIState = (state: RootState) => state[sliceName];
export const getUISize = (state: RootState) => getUIState(state).size;
export default uiSlice.reducer;
