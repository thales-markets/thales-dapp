import { all } from 'redux-saga/effects';
import { watchFetchRatesRequest } from './modules/rates';

const rootSaga = function* () {
    yield all([watchFetchRatesRequest()]);
};

export default rootSaga;
