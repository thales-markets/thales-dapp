import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'utils/formatters';
import { defaultNetwork, NetworkId } from 'utils/network';
import { RootState } from 'redux/rootReducer';

export type WalletDetailsSliceState = {
    walletType: string;
    unlocked: boolean;
    currentWallet: string | null;
    unlockError: string | null;
    walletPaginatorIndex: number;
    availableWallets: string[];
    networkId: NetworkId;
    networkName: string;
};

const initialState: WalletDetailsSliceState = {
    walletType: '',
    unlocked: false,
    unlockError: null,
    walletPaginatorIndex: 0,
    availableWallets: [],
    currentWallet: null,
    networkId: defaultNetwork.networkId,
    networkName: defaultNetwork.name,
};

const sliceName = 'walletDetails';

export const walletDetailsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        resetWalletReducer: () => {
            return initialState;
        },
        updateWalletReducer: (state, action: PayloadAction<Partial<WalletDetailsSliceState>>) => {
            const { payload } = action;

            return {
                ...state,
                ...payload,
                currentWallet: payload.currentWallet ? getAddress(payload.currentWallet) : state.currentWallet,
            };
        },
        updateNetworkSettings: (
            state,
            action: PayloadAction<{
                networkId: NetworkId;
                networkName: string;
            }>
        ) => {
            const { networkId, networkName } = action.payload;

            state.networkId = networkId;
            state.networkName = networkName;
        },
    },
});

export const getWalletState = (state: RootState) => state.wallet[sliceName];
export const getNetworkId = (state: RootState) => getWalletState(state).networkId;
export const getNetworkName = (state: RootState) => getWalletState(state).networkName;
export const getNetwork = (state: RootState) => ({
    networkId: getNetworkId(state),
    networkName: getNetworkName(state),
});
export const getCurrentWalletAddress = (state: RootState) => getWalletState(state).currentWallet;
export const getIsWalletConnected = createSelector(getCurrentWalletAddress, (currentWallet) =>
    currentWallet != null ? true : false
);
export const getWalletInfo = (state: RootState) => getWalletState(state);

export const { updateNetworkSettings, resetWalletReducer, updateWalletReducer } = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
