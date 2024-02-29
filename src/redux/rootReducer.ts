import { combineReducers } from '@reduxjs/toolkit';
import app from './modules/app';
import marketWidgets from './modules/marketWidgets';
import ui from './modules/ui';
import wallet from './modules/wallet';

const rootReducer = combineReducers({
    app,
    wallet,
    ui,
    marketWidgets,
});

export default rootReducer;
