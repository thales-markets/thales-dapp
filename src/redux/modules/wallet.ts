import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from 'utils/formatters/ethers';
import { defaultNetwork, NetworkId, formatGasLimit } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_SPEED } from 'constants/defaults';
import { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import { COLLATERALS_INDEX } from 'constants/options';

const sliceName = 'wallet';

export type WalletSliceState = {
    walletAddress: string | null;
    networkId: NetworkId;
    networkName: string;
    gasSpeed: GasSpeed;
    customGasPrice: number | null;
    gasLimit: number;
    selectedCollateral: COLLATERALS_INDEX;
};

const initialState: WalletSliceState = {
    walletAddress: null,
    networkId: defaultNetwork.networkId,
    networkName: defaultNetwork.name,
    gasSpeed: DEFAULT_GAS_SPEED,
    customGasPrice: null,
    gasLimit: DEFAULT_GAS_LIMIT,
    selectedCollateral: COLLATERALS_INDEX.sUSD,
};

export const walletDetailsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        resetWallet: () => {
            return initialState;
        },
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
        setGasSpeed: (state, action: PayloadAction<GasSpeed>) => {
            state.gasSpeed = action.payload;
        },
        setCustomGasPrice: (state, action: PayloadAction<number | null>) => {
            state.customGasPrice = action.payload;
        },
        setGasLimit: (state, action: PayloadAction<number>) => {
            state.gasLimit = formatGasLimit(action.payload, state.networkId);
        },
        setSelectedCollateral: (state, action: PayloadAction<number>) => {
            state.selectedCollateral = action.payload;
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

export const getSelectedCollateral = (state: RootState) => getWalletState(state).selectedCollateral;

export const {
    updateNetworkSettings,
    resetWallet,
    updateWallet,
    setGasSpeed,
    setCustomGasPrice,
    setGasLimit,
    setSelectedCollateral,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
