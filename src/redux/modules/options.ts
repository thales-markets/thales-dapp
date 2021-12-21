import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/rootReducer';
import { OptionsTransaction, OptionsTransactions } from 'types/options';

const sliceName = 'options';

type OptionsSliceState = {
    pendingTransactions: OptionsTransactions;
};

const initialState: OptionsSliceState = {
    pendingTransactions: [],
};

export const optionsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        addOptionsPendingTransaction: (
            state,
            action: PayloadAction<{
                optionTransaction: Omit<OptionsTransaction, 'status' | 'timestamp'>;
            }>
        ) => {
            const { optionTransaction } = action.payload;

            const optionTransactionWithStatus: OptionsTransaction = {
                ...optionTransaction,
                status: 'pending',
                timestamp: Date.now(),
            };

            state.pendingTransactions.unshift(optionTransactionWithStatus);
        },
        updateOptionsPendingTransactionStatus: (
            state,
            action: PayloadAction<{
                hash: OptionsTransaction['hash'];
                status: OptionsTransaction['status'];
                blockNumber: OptionsTransaction['blockNumber'];
            }>
        ) => {
            const { hash, status, blockNumber } = action.payload;

            state.pendingTransactions.forEach((optionTransaction, idx) => {
                if (optionTransaction.hash === hash) {
                    state.pendingTransactions[idx].status = status;
                    state.pendingTransactions[idx].blockNumber = blockNumber;
                }
            });
        },
    },
});

export const getOptionsPendingTransactions = (state: RootState) => state[sliceName].pendingTransactions;

export const { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } = optionsSlice.actions;

export default optionsSlice.reducer;
