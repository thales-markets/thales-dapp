import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/rootReducer';
import { OptionsTransaction, OptionsTransactions } from 'types/options';

const sliceName = 'optionsPendingTransactions';

const initialState: OptionsTransactions = [];

export const optionsPendingTransactionsSlice = createSlice({
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

            state.unshift(optionTransactionWithStatus);
        },
        updateOptionsPendingTransactionStatus: (
            state,
            action: PayloadAction<{
                hash: OptionsTransaction['hash'];
                status: OptionsTransaction['status'];
            }>
        ) => {
            const { hash, status } = action.payload;

            state.forEach((optionTransaction, idx) => {
                if (optionTransaction.hash === hash) {
                    state[idx].status = status;
                }
            });
        },
    },
});

export const getOptionsPendingTransactions = (state: RootState) => state[sliceName];

export const {
    addOptionsPendingTransaction,
    updateOptionsPendingTransactionStatus,
} = optionsPendingTransactionsSlice.actions;

export default optionsPendingTransactionsSlice.reducer;
