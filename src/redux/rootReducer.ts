import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import synths from './modules/synths';
import rates from './modules/rates';

const rootReducer = combineReducers({
    ui,
    synths,
    rates,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
