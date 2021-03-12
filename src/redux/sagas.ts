import { all } from 'redux-saga/effects';
import { watchFetchSystemStatusRequest } from './modules/app';

const rootSaga = function* () {
    yield all([watchFetchSystemStatusRequest()]);
};

export default rootSaga;
