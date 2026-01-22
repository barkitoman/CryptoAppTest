import { ConnectionStatus, CryptoPriceUpdate } from '../../domain/entities/Cryptocurrency';

type PriceUpdateCallback = (update: CryptoPriceUpdate) => void;
type ConnectionStatusCallback = (status: ConnectionStatus) => void;

interface CoinCapPriceMessage {
    [key: string]: string;
}

class CryptoWebSocketDataSource {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // Start with 1 second
    private maxReconnectDelay = 30000; // Max 30 seconds
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private priceUpdateCallbacks: PriceUpdateCallback[] = [];
    private connectionStatusCallbacks: ConnectionStatusCallback[] = [];
    private isIntentionallyClosed = false;
    private subscribedAssets: string[] = [];

    private readonly WS_URL = 'wss://ws.coincap.io/prices?assets=ALL';

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('✅ WebSocket already connected');
            return;
        }

        this.isIntentionallyClosed = false;
        this.updateConnectionStatus(ConnectionStatus.CONNECTING);
        console.log('🔄 Connecting to WebSocket:', this.WS_URL);

        try {
            this.ws = new WebSocket(this.WS_URL);

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onerror = this.handleError.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
        } catch (error) {
            console.warn('⚠️ Could not create WebSocket connection');
            this.updateConnectionStatus(ConnectionStatus.ERROR);
            this.scheduleReconnect();
        }
    }

    disconnect() {
        this.isIntentionallyClosed = true;

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.updateConnectionStatus(ConnectionStatus.DISCONNECTED);
    }

    onPriceUpdate(callback: PriceUpdateCallback) {
        this.priceUpdateCallbacks.push(callback);

        return () => {
            this.priceUpdateCallbacks = this.priceUpdateCallbacks.filter((cb) => cb !== callback);
        };
    }

    onConnectionStatusChange(callback: ConnectionStatusCallback) {
        this.connectionStatusCallbacks.push(callback);

        return () => {
            this.connectionStatusCallbacks = this.connectionStatusCallbacks.filter(
                (cb) => cb !== callback,
            );
        };
    }

    private handleOpen() {
        console.log('✅ WebSocket connected successfully!');
        console.log('📊 Real-time price updates are now active');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.updateConnectionStatus(ConnectionStatus.CONNECTED);
    }

    private handleMessage(event: MessageEvent) {
        try {
            const data: CoinCapPriceMessage = JSON.parse(event.data);
            Object.entries(data).forEach(([id, priceStr]) => {
                const priceUpdate: CryptoPriceUpdate = {
                    id,
                    priceUsd: parseFloat(priceStr),
                    timestamp: Date.now(),
                };

                this.notifyPriceUpdate(priceUpdate);
            });
        } catch {
            console.log('socket onerror');
        }
    }

    private handleError(event: Event) {
        this.updateConnectionStatus(ConnectionStatus.ERROR);
    }

    private handleClose(event: CloseEvent) {
        this.ws = null;

        if (!this.isIntentionallyClosed) {
            this.updateConnectionStatus(ConnectionStatus.DISCONNECTED);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect() {
        if (this.isIntentionallyClosed) {
            return;
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.updateConnectionStatus(ConnectionStatus.ERROR);
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(
            this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
            this.maxReconnectDelay,
        );

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    private notifyPriceUpdate(update: CryptoPriceUpdate) {
        this.priceUpdateCallbacks.forEach((callback) => {
            try {
                callback(update);
            } catch {
                console.log('Error parsing WebSocket message');
            }
        });
    }

    private updateConnectionStatus(status: ConnectionStatus) {
        this.connectionStatusCallbacks.forEach((callback) => {
            try {
                callback(status);
            } catch (error) {
                console.error('Error in connection status callback:', error);
            }
        });
    }

}

export default new CryptoWebSocketDataSource();
