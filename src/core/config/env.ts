import Constants from 'expo-constants';

/**
 * Environment configuration module.
 * Uses EXPO_PUBLIC_ prefix for environment variables to be accessible in Expo.
 */

export const env = {
    COINMARKETCAP_API_BASE: process.env.EXPO_PUBLIC_COINMARKETCAP_API_BASE || 'https://pro-api.coinmarketcap.com/v1',
    COINMARKETCAP_API_KEY: process.env.EXPO_PUBLIC_COINMARKETCAP_API_KEY || '',
    COINCAP_WS_URL: process.env.EXPO_PUBLIC_COINCAP_WS_URL || 'wss://ws.coincap.io/prices',

    FEATURES: {
        ENABLE_CMC: process.env.EXPO_PUBLIC_ENABLE_CMC === 'true',
        ENABLE_WEBSOCKET: process.env.EXPO_PUBLIC_ENABLE_WEBSOCKET === 'true',
        ENABLE_CHARTS: process.env.EXPO_PUBLIC_ENABLE_CHARTS === 'true',
    },

    extra: Constants.expoConfig?.extra || {},
};

if (!env.COINMARKETCAP_API_KEY && env.FEATURES.ENABLE_CMC) {
    console.warn('⚠️  CoinMarketCap API Key is missing! Check your .env file.');
}
