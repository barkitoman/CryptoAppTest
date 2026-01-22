import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { container, SERVICES } from '../../../../core/di/container';
import { GetCryptocurrenciesUseCase } from '../../domain/usecases/GetCryptocurrenciesUseCase';
import { useAppDispatch } from '../../../../store/hooks';
import { setCryptocurrencies, setLoading, setError } from '../slices/cryptoSlice';

export const useCryptocurrencies = () => {
    const dispatch = useAppDispatch();

    console.log('🎯 useCryptocurrencies hook initializing...');

    const query = useQuery<Cryptocurrency[], Error>({
        queryKey: ['cryptocurrencies'],
        queryFn: async () => {
            console.log('🚀 Fetching fresh cryptocurrencies data...');

            try {
                const useCase = container.resolve<GetCryptocurrenciesUseCase>(
                    SERVICES.GET_CRYPTOCURRENCIES_USE_CASE,
                );
                const data = await useCase.execute(200);
                dispatch(setCryptocurrencies(data));
                dispatch(setLoading(false));

                return data;
            } catch (error) {
                console.error('❌ Fetch failed:', error);
                throw error;
            }
        },
        staleTime: 30 * 1000,
        networkMode: 'offlineFirst',
    });

    useEffect(() => {
        if (query.error) {
            console.error('❌ Query error detected:', query.error);
            const errorMessage =
                query.error instanceof Error
                    ? query.error.message
                    : 'Failed to fetch cryptocurrencies';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
        }
    }, [query.error, dispatch]);

    return query;
};
