import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import wallet from './modules/wallet';
import options from './modules/options';
import app from './modules/app';

const rootReducer = combineReducers({
    app,
    wallet,
    ui,
    options,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
