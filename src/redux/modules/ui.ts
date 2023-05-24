import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

const sliceName = 'ui';

export enum UISize {
    Small,
    Medium,
    Large,
}

type UISliceState = {
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
    size: initialUISize(),
};

export const uiSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
});

export const getUIState = (state: RootState) => state[sliceName];
export const getUISize = (state: RootState) => getUIState(state).size;

export default uiSlice.reducer;
