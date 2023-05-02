import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { Theme } from 'constants/ui';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import localStore from 'utils/localStore';

const sliceName = 'ui';

export enum UISize {
    Small,
    Medium,
    Large,
}

const getDefaultTheme = (): Theme => {
    const lsTheme = localStore.get(LOCAL_STORAGE_KEYS.UI_THEME);
    return (lsTheme !== undefined ? lsTheme : Theme.DARK) as Theme;
};

type UISliceState = {
    theme: Theme;
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
    theme: getDefaultTheme(),
    size: initialUISize(),
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<number>) => {
            state.theme = action.payload;
            localStore.set(LOCAL_STORAGE_KEYS.UI_THEME, action.payload);
        },
    },
});

export const { setTheme } = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const getUISize = (state: RootState) => getUIState(state).size;
export const getTheme = (state: RootState) => getUIState(state).theme;

export default uiSlice.reducer;
