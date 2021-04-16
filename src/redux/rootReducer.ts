import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import wallet from './modules/wallet';
import options from './modules/options';
import app from './modules/app';
import marketWidgets from './modules/marketWidgets';

const rootReducer = combineReducers({
    app,
    wallet,
    ui,
    options,
    marketWidgets,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
