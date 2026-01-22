import { env } from '../../../../core/config/env';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';

const COINMARKETCAP_API_BASE = env.COINMARKETCAP_API_BASE;
const API_Key = env.COINMARKETCAP_API_KEY;

interface CoinMarketCapQuote {
    price: number;
    volume_24h: number;
    percent_change_24h: number;
    market_cap: number;
    last_updated: string;
}

interface CoinMarketCapData {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    cmc_rank: number;
    circulating_supply: number;
    quote: {
        USD: CoinMarketCapQuote;
    };
}

interface CoinMarketCapResponse {
    data: CoinMarketCapData[];
    status: {
        error_code: number;
        error_message: string | null;
    };
}

interface CoinMarketCapHistoricalQuote {
    timestamp: string;
    quote: {
        USD: {
            price: number;
        };
    };
}

interface CoinMarketCapHistoricalResponse {
    data: {
        quotes: CoinMarketCapHistoricalQuote[];
    };
    status: {
        error_code: number;
        error_message: string | null;
    };
}

class CoinMarketCapDataSource {
    private baseUrl = COINMARKETCAP_API_BASE;
    private apiKey = API_Key;

    async getCryptocurrencies(start: number = 1, limit: number = 50): Promise<Cryptocurrency[]> {
        if (this.apiKey === 'YOUR_API_KEY_HERE') {
            console.error('❌ API Key missing! Please set your CoinMarketCap API Key.');
            throw new Error('API Key missing');
        }

        const url = `${this.baseUrl}/cryptocurrency/listings/latest?start=${start}&limit=${limit}&convert=USD`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-CMC_PRO_API_KEY': this.apiKey,
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} ${errorText}`);
            }

            const result: CoinMarketCapResponse = await response.json();

            if (result.status.error_code !== 0) {
                throw new Error(`CMC Error: ${result.status.error_message}`);
            }

            return result.data.map(this.mapToDomain);
        } catch (error) {
            console.error('❌ Fetch failed:', error);
            throw error;
        }
    }

    async getHistoricalPrices(
        id: string,
        days: number = 7,
    ): Promise<{ timestamp: number; price: number }[]> {
        // NOTE: In a real CMC API context, for free plans, you might need to use 
        // listings/latest with aux=sparkline or follow the paid plan endpoints.
        // We'll implement the standard historical quotes endpoint (v2).
        const interval = days <= 1 ? '5m' : days <= 7 ? '1h' : '1d';
        const url = `${this.baseUrl}/cryptocurrency/quotes/historical?slug=${id}&count=${days * 24}&interval=${interval}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-CMC_PRO_API_KEY': this.apiKey,
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`CMC Historical API Error: ${response.status} ${errorText}`);
            }

            const result: CoinMarketCapHistoricalResponse = await response.json();

            if (result.status.error_code !== 0) {
                throw new Error(`CMC Error: ${result.status.error_message}`);
            }

            return result.data.quotes.map((q) => ({
                timestamp: new Date(q.timestamp).getTime(),
                price: q.quote.USD.price,
            }));
        } catch (error) {
            throw error;
        }
    }

    private mapToDomain(item: CoinMarketCapData): Cryptocurrency {
        return {
            id: item.slug,
            rank: item.cmc_rank,
            symbol: item.symbol,
            name: item.name,
            priceUsd: item.quote.USD.price,
            changePercent24Hr: item.quote.USD.percent_change_24h,
            marketCapUsd: item.quote.USD.market_cap,
            volumeUsd24Hr: item.quote.USD.volume_24h,
            supply: item.circulating_supply,
            lastUpdated: new Date(item.quote.USD.last_updated).getTime(),
        };
    }
}

export default new CoinMarketCapDataSource();
