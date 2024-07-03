import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_NETWORK } from 'constants/network';
import { Network } from 'enums/network';
import { getAddress } from 'thales-utils';
import { SupportedNetwork } from 'types/network';
import { RootState, WalletSliceState } from 'types/ui';

const sliceName = 'wallet';

const initialState: WalletSliceState = {
    walletAddress: null,
    networkId: DEFAULT_NETWORK.networkId,
    switchToNetworkId: DEFAULT_NETWORK.networkId,
    selectedCollateralIndex: 0,
};

const walletDetailsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        updateWallet: (state, action: PayloadAction<Partial<WalletSliceState>>) => {
            const { payload } = action;
            const newState = {
                ...state,
                ...payload,
                walletAddress: payload.walletAddress ? getAddress(payload.walletAddress) : null,
            };

            return newState;
        },
        updateNetworkSettings: (
            state,
            action: PayloadAction<{
                networkId: SupportedNetwork;
            }>
        ) => {
            const { networkId } = action.payload;

            state.networkId = networkId;
        },
        switchToNetworkId: (
            state,
            action: PayloadAction<{
                networkId: Network;
            }>
        ) => {
            state.switchToNetworkId = action.payload.networkId;
        },
        setSelectedCollateralIndex: (state, action: PayloadAction<number>) => {
            state.selectedCollateralIndex = action.payload;
        },
    },
});

const getWalletState = (state: RootState) => state[sliceName];
export const getNetworkId = (state: RootState) => getWalletState(state).networkId;
export const getSwitchToNetworkId = (state: RootState) => getWalletState(state).switchToNetworkId;
export const getWalletAddress = (state: RootState) => getWalletState(state).walletAddress;
export const getIsWalletConnected = createSelector(getWalletAddress, (walletAddress) => walletAddress != null);

export const getSelectedCollateralIndex = (state: RootState) => getWalletState(state).selectedCollateralIndex;

export const {
    updateNetworkSettings,
    switchToNetworkId,
    updateWallet,
    setSelectedCollateralIndex,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
