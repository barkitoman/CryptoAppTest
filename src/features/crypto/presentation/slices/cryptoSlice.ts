import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import {
    Cryptocurrency,
    CryptoPriceUpdate,
    ConnectionStatus,
} from '../../domain/entities/Cryptocurrency';
import { RootState } from '../../../../store/index';

interface CryptoState {
    cryptocurrencies: Record<string, Cryptocurrency>;
    connectionStatus: ConnectionStatus;
    isLoading: boolean;
    error: string | null;
    lastUpdate: number | null;
}

const initialState: CryptoState = {
    cryptocurrencies: {},
    connectionStatus: ConnectionStatus.DISCONNECTED,
    isLoading: false,
    error: null,
    lastUpdate: null,
};

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState,
    reducers: {
        setCryptocurrencies: (state, action: PayloadAction<Cryptocurrency[]>) => {
            state.cryptocurrencies = {};
            action.payload.forEach((crypto) => {
                state.cryptocurrencies[crypto.id] = crypto;
            });
            state.lastUpdate = Date.now();
            state.isLoading = false;
            state.error = null;
        },
        updatePrice: (state, action: PayloadAction<CryptoPriceUpdate>) => {
            const { id, priceUsd, timestamp } = action.payload;
            const crypto = state.cryptocurrencies[id];

            if (crypto) {
                crypto.priceUsd = priceUsd;
                crypto.lastUpdated = timestamp;
            }
        },
        setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.connectionStatus = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setCryptocurrencies, updatePrice, setConnectionStatus, setLoading, setError } =
    cryptoSlice.actions;

export const selectAllCryptos = (state: RootState) => Object.values(state.crypto.cryptocurrencies);

export const selectCryptoById = (id: string) => (state: RootState) =>
    state.crypto.cryptocurrencies[id];

export const selectConnectionStatus = (state: RootState) => state.crypto.connectionStatus;

export const selectIsLoading = (state: RootState) => state.crypto.isLoading;

export const selectError = (state: RootState) => state.crypto.error;

export const selectLastUpdate = (state: RootState) => state.crypto.lastUpdate;

export const selectSortedCryptos = createSelector(
    [(state: RootState) => state.crypto.cryptocurrencies],
    (cryptocurrencies) => {
        const cryptoArray = Object.values(cryptocurrencies);
        return cryptoArray.sort((a, b) => a.rank - b.rank);
    },
);

export const selectCryptoCount = createSelector([selectAllCryptos], (cryptos) => cryptos.length);

export default cryptoSlice.reducer;
