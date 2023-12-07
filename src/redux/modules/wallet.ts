import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_NETWORK } from 'constants/network';
import { Network } from 'enums/network';
import { RootState } from 'redux/rootReducer';
import { getAddress } from 'thales-utils';

const sliceName = 'wallet';

type WalletSliceState = {
    walletAddress: string | null;
    networkId: Network;
    isAA: boolean;
    networkName: string;
    switchToNetworkId: Network; // used to trigger manually network switch in App.js
    selectedCollateralIndex: number;
    walletConnectModal: {
        visibility: boolean;
        origin?: 'sign-up' | 'sign-in' | undefined;
    };
};

const initialState: WalletSliceState = {
    walletAddress: null,
    networkId: DEFAULT_NETWORK.networkId,
    isAA: false,
    networkName: DEFAULT_NETWORK.name,
    switchToNetworkId: DEFAULT_NETWORK.networkId,
    selectedCollateralIndex: 0,
    walletConnectModal: {
        visibility: false,
        origin: undefined,
    },
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
        setWalletConnectModalVisibility: (
            state,
            action: PayloadAction<{ visibility: boolean; origin?: 'sign-up' | 'sign-in' | undefined }>
        ) => {
            state.walletConnectModal.visibility = action.payload.visibility;
            state.walletConnectModal.origin = action.payload.origin;
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
export const getIsWalletConnected = createSelector(getWalletAddress, (walletAddress) => walletAddress != null);
export const getIsAA = (state: RootState) => getWalletState(state).isAA;
export const getSelectedCollateralIndex = (state: RootState) => getWalletState(state).selectedCollateralIndex;
export const getWalletConnectModalOrigin = (state: RootState) => getWalletState(state).walletConnectModal.origin;
export const getWalletConnectModalVisibility = (state: RootState) =>
    getWalletState(state).walletConnectModal.visibility;

export const {
    updateNetworkSettings,
    switchToNetworkId,
    updateWallet,
    setSelectedCollateralIndex,
    setWalletConnectModalVisibility,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
