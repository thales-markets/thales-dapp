import { GAS_LIMIT_BUFFER } from '../constants/transaction';

export const normalizeGasLimit = (gasLimit: number) => gasLimit + GAS_LIMIT_BUFFER;
