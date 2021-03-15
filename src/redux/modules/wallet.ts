import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'utils/formatters';
import { defaultNetwork, NetworkId, normalizeGasLimit } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_SPEED } from 'constants/defaults';
import { GasSpeed } from 'queries/network/useEthGasPriceQuery';

export type WalletSliceState = {
    walletType: string;
    unlocked: boolean;
    currentWallet: string | null;
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
    currentWallet: null,
    networkId: defaultNetwork.networkId,
    networkName: defaultNetwork.name,
    gasSpeed: DEFAULT_GAS_SPEED,
    customGasPrice: null,
    gasLimit: DEFAULT_GAS_LIMIT,
};

const sliceName = 'wallet';

export const walletDetailsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        resetWalletReducer: () => {
            return initialState;
        },
        updateWalletReducer: (state, action: PayloadAction<Partial<WalletSliceState>>) => {
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
        setGasSpeed: (state, action: PayloadAction<GasSpeed>) => {
            return {
                ...state,
                gasSpeed: action.payload,
            };
        },
        setCustomGasPrice: (state, action: PayloadAction<number | null>) => {
            return {
                ...state,
                customGasPrice: action.payload,
            };
        },
        setGasLimit: (state, action: PayloadAction<number>) => {
            return {
                ...state,
                gasLimit: normalizeGasLimit(action.payload),
            };
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
export const getCurrentWalletAddress = (state: RootState) => getWalletState(state).currentWallet;
export const getIsWalletConnected = createSelector(getCurrentWalletAddress, (currentWallet) =>
    currentWallet != null ? true : false
);
export const getWalletInfo = (state: RootState) => getWalletState(state);

export const getGasSpeed = (state: RootState) => getWalletState(state).gasSpeed;
export const getGasLimit = (state: RootState) => getWalletState(state).gasLimit;
export const getCustomGasPrice = (state: RootState) => getWalletState(state).customGasPrice;

export const {
    updateNetworkSettings,
    resetWalletReducer,
    updateWalletReducer,
    setGasSpeed,
    setCustomGasPrice,
    setGasLimit,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
