import { useEffect } from 'react';
import CryptoWebSocketDataSource from '../../data/datasources/CryptoWebSocketDataSource';
import { useAppDispatch } from '../../../../store/hooks';
import { updatePrice, setConnectionStatus } from '../slices/cryptoSlice';

export const useWebSocketPrices = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribePrice = CryptoWebSocketDataSource.onPriceUpdate((update) => {
            dispatch(updatePrice(update));
        });

        const unsubscribeStatus = CryptoWebSocketDataSource.onConnectionStatusChange((status) => {
            dispatch(setConnectionStatus(status));
        });

        CryptoWebSocketDataSource.connect();

        return () => {
            unsubscribePrice();
            unsubscribeStatus();
            CryptoWebSocketDataSource.disconnect();
        };
    }, [dispatch]);
};
