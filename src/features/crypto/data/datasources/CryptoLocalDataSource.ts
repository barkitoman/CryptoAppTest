import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';

const STORAGE_KEYS = {
    CRYPTOCURRENCIES: '@crypto_app:cryptocurrencies',
    LAST_UPDATE: '@crypto_app:last_update',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class CryptoLocalDataSource {
    async saveCryptocurrencies(cryptocurrencies: Cryptocurrency[]): Promise<void> {
        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.CRYPTOCURRENCIES, JSON.stringify(cryptocurrencies)],
                [STORAGE_KEYS.LAST_UPDATE, Date.now().toString()],
            ]);
        } catch (error) {
            console.error('Error saving cryptocurrencies to storage:', error);
            throw error;
        }
    }

    async getCryptocurrencies(): Promise<Cryptocurrency[] | null> {
        try {
            const [[, cryptoData], [, lastUpdateStr]] = await AsyncStorage.multiGet([
                STORAGE_KEYS.CRYPTOCURRENCIES,
                STORAGE_KEYS.LAST_UPDATE,
            ]);

            if (!cryptoData || !lastUpdateStr) {
                return null;
            }

            const lastUpdate = parseInt(lastUpdateStr, 10);
            const now = Date.now();

            if (now - lastUpdate > CACHE_DURATION) {
                return null;
            }

            return JSON.parse(cryptoData);
        } catch (error) {
            return null;
        }
    }

    async clearCache(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.CRYPTOCURRENCIES,
                STORAGE_KEYS.LAST_UPDATE,
            ]);
        } catch (error) {
            console.error('Error clearing cache:', error);
            throw error;
        }
    }

    async isCacheValid(): Promise<boolean> {
        try {
            const lastUpdateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE);

            if (!lastUpdateStr) {
                return false;
            }

            const lastUpdate = parseInt(lastUpdateStr, 10);
            const now = Date.now();

            return now - lastUpdate <= CACHE_DURATION;
        } catch (error) {
            console.error('Error checking cache validity:', error);
            return false;
        }
    }
}

export default new CryptoLocalDataSource();
