import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'thales-utils';
import { RootState } from 'redux/rootReducer';
import { Network } from 'enums/network';
import { DEFAULT_NETWORK } from 'constants/network';
// import { BiconomyAccountModule } from '@biconomy/particle-auth';

const sliceName = 'wallet';

type WalletSliceState = {
    walletAddress: string | null;
    swAddress: string | null;
    // smartAccount: BiconomyAccountModule.SmartAccount | null;
    networkId: Network;
    networkName: string;
    switchToNetworkId: Network; // used to trigger manually network switch in App.js
    selectedCollateralIndex: number;
};

const initialState: WalletSliceState = {
    walletAddress: null,
    swAddress: null,
    // smartAccount: null,
    networkId: DEFAULT_NETWORK.networkId,
    networkName: DEFAULT_NETWORK.name,
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
                swAddress: payload.swAddress ?? null,
            };

            return newState;
        },
        updateNetworkSettings: (
            state,
            action: PayloadAction<{
                networkId: Network;
                networkName: string;
            }>
        ) => {
            const { networkId, networkName } = action.payload;

            state.networkId = networkId;
            state.networkName = networkName;
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
const getNetworkName = (state: RootState) => getWalletState(state).networkName;
export const getNetwork = (state: RootState) => ({
    networkId: getNetworkId(state),
    networkName: getNetworkName(state),
});
export const getSwitchToNetworkId = (state: RootState) => getWalletState(state).switchToNetworkId;
export const getWalletAddress = (state: RootState) => getWalletState(state).walletAddress;
export const getSmartAccountAddress = (state: RootState) => getWalletState(state).swAddress;
// export const getSmartAccount = (state: RootState) => getWalletState(state).smartAccount;
export const getIsWalletConnected = createSelector(getWalletAddress, (walletAddress) => walletAddress != null);

export const getSelectedCollateralIndex = (state: RootState) => getWalletState(state).selectedCollateralIndex;

export const {
    updateNetworkSettings,
    switchToNetworkId,
    updateWallet,
    setSelectedCollateralIndex,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
