import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { container, SERVICES } from '../../../../core/di/container';
import { GetCryptocurrenciesUseCase } from '../../domain/usecases/GetCryptocurrenciesUseCase';
import { useAppDispatch } from '../../../../store/hooks';
import { setCryptocurrencies, setLoading, setError } from '../slices/cryptoSlice';

const PAGE_SIZE = 50;

export const useCryptocurrencies = () => {
    const dispatch = useAppDispatch();

    const query = useInfiniteQuery<Cryptocurrency[], Error>({
        queryKey: ['cryptocurrencies'],
        queryFn: async ({ pageParam = 1 }) => {
            const start = pageParam as number;

            try {
                const useCase = container.resolve<GetCryptocurrenciesUseCase>(
                    SERVICES.GET_CRYPTOCURRENCIES_USE_CASE,
                );
                const data = await useCase.execute(start, PAGE_SIZE);

                if (start === 1) {
                    dispatch(setCryptocurrencies(data));
                    dispatch(setLoading(false));
                }

                return data;
            } catch (error) {
                console.error('❌ Fetch failed:', error);
                throw error;
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length * PAGE_SIZE + 1;
        },
        staleTime: 30 * 1000,
        networkMode: 'offlineFirst',
    });

    const cryptocurrencies = useMemo(() => {
        return query.data?.pages.flat() ?? [];
    }, [query.data]);

    useEffect(() => {
        if (query.error) {
            const errorMessage =
                query.error instanceof Error
                    ? query.error.message
                    : 'Failed to fetch cryptocurrencies';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
        }
    }, [query.error, dispatch]);

    return {
        ...query,
        cryptocurrencies,
    };
};
