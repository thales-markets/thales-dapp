import { all } from 'redux-saga/effects';
import { watchFetchSystemStatusRequest } from './modules/app';
import { watchFetchRatesRequest } from './modules/rates';

const rootSaga = function* () {
    yield all([watchFetchRatesRequest(), watchFetchSystemStatusRequest()]);
};

export default rootSaga;
