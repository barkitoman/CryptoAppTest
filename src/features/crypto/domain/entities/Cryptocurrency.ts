export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    priceUsd: number;
    changePercent24Hr: number;
    marketCapUsd: number;
    volumeUsd24Hr: number;
    supply: number;
    maxSupply?: number;
    vwap24Hr?: number;
    rank: number;
    lastUpdated: number;
}

export interface CryptoPriceUpdate {
    id: string;
    priceUsd: number;
    timestamp: number;
}

export enum ConnectionStatus {
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
}
