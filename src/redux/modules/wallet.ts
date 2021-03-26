import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'utils/formatters/ethers';
import { defaultNetwork, NetworkId, normalizeGasLimit } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_SPEED } from 'constants/defaults';
import { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import { setSigner } from 'utils/snxJSConnector';
import { getPersistedState, persistState } from 'redux/persistedState';

const sliceName = 'wallet';

export const getPersistedStateAndSetSigner = () => {
    const persistedState = getPersistedState(sliceName);
    if (persistedState.walletAddress != null) {
        setSigner({ type: persistedState.walletType, networkId: persistedState.networkId });
    }

    return persistedState;
};

export type WalletSliceState = {
    walletType: string;
    unlocked: boolean;
    walletAddress: string | null;
    unlockError: string | null;
    walletPaginatorIndex: number;
    availableWallets: string[];
    networkId: NetworkId;
    networkName: string;
    gasSpeed: GasSpeed;
    customGasPrice: number | null;
    gasLimit: number;
};

const initialState: WalletSliceState = {
    walletType: '',
    unlocked: false,
    unlockError: null,
    walletPaginatorIndex: 0,
    availableWallets: [],
    walletAddress: null,
    networkId: defaultNetwork.networkId,
    networkName: defaultNetwork.name,
    gasSpeed: DEFAULT_GAS_SPEED,
    customGasPrice: null,
    gasLimit: DEFAULT_GAS_LIMIT,
    //...getPersistedStateAndSetSigner(),
};

export const walletDetailsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        resetWallet: () => {
            persistState(sliceName, initialState);
            return initialState;
        },
        updateWallet: (state, action: PayloadAction<Partial<WalletSliceState>>) => {
            const { payload } = action;
            const newState = {
                ...state,
                ...payload,
                walletAddress: payload.walletAddress ? getAddress(payload.walletAddress) : state.walletAddress,
            };

            persistState(sliceName, newState);
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
            persistState(sliceName, state);
        },
        setGasSpeed: (state, action: PayloadAction<GasSpeed>) => {
            state.gasSpeed = action.payload;
            persistState(sliceName, state);
        },
        setCustomGasPrice: (state, action: PayloadAction<number | null>) => {
            state.customGasPrice = action.payload;
            persistState(sliceName, state);
        },
        setGasLimit: (state, action: PayloadAction<number>) => {
            state.gasLimit = normalizeGasLimit(action.payload);
            persistState(sliceName, state);
        },
    },
});

export const getWalletState = (state: RootState) => state[sliceName];
export const getNetworkId = (state: RootState) => getWalletState(state).networkId;
export const getNetworkName = (state: RootState) => getWalletState(state).networkName;
export const getNetwork = (state: RootState) => ({
    networkId: getNetworkId(state),
    networkName: getNetworkName(state),
});
export const getWalletAddress = (state: RootState) => getWalletState(state).walletAddress;
export const getIsWalletConnected = createSelector(getWalletAddress, (walletAddress) => walletAddress != null);
export const getWalletInfo = (state: RootState) => getWalletState(state);

export const getGasSpeed = (state: RootState) => getWalletState(state).gasSpeed;
export const getGasLimit = (state: RootState) => getWalletState(state).gasLimit;
export const getCustomGasPrice = (state: RootState) => getWalletState(state).customGasPrice;

export const {
    updateNetworkSettings,
    resetWallet,
    updateWallet,
    setGasSpeed,
    setCustomGasPrice,
    setGasLimit,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
