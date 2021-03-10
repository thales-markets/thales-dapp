import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import synths from './modules/synths';
import rates from './modules/rates';
import wallet from './modules/wallet';
import options from './modules/options';

const rootReducer = combineReducers({
    wallet,
    ui,
    synths,
    rates,
    options,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
