import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import synths from './modules/synths';
import wallet from './modules/wallet';
import options from './modules/options';
import app from './modules/app';
import transaction from './modules/transaction';

const rootReducer = combineReducers({
    app,
    wallet,
    ui,
    synths,
    options,
    transaction,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
