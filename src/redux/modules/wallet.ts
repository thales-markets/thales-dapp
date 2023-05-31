import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'utils/formatters/ethers';
import { defaultNetwork, NetworkId } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { COLLATERALS_INDEX } from 'constants/options';

const sliceName = 'wallet';

type WalletSliceState = {
    walletAddress: string | null;
    networkId: NetworkId;
    networkName: string;
    switchToNetworkId: NetworkId; // used to trigger manually network switch in App.js
    selectedCollateral: COLLATERALS_INDEX;
};

const initialState: WalletSliceState = {
    walletAddress: null,
    networkId: defaultNetwork.networkId,
    networkName: defaultNetwork.name,
    switchToNetworkId: defaultNetwork.networkId,
    selectedCollateral: COLLATERALS_INDEX.sUSD,
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
                networkId: NetworkId;
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
                networkId: NetworkId;
            }>
        ) => {
            state.switchToNetworkId = action.payload.networkId;
        },
        setSelectedCollateral: (state, action: PayloadAction<number>) => {
            state.selectedCollateral = action.payload;
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

export const getSelectedCollateral = (state: RootState) => getWalletState(state).selectedCollateral;

export const {
    updateNetworkSettings,
    switchToNetworkId,
    updateWallet,
    setSelectedCollateral,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
