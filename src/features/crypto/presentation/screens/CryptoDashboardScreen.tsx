import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, TextInput, RefreshControl, View } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { useCryptocurrencies } from '../hooks/useCryptocurrencies';
import { useWebSocketPrices } from '../hooks/useWebSocketPrices';
import { useAppSelector } from '../../../../store/hooks';
import { useTheme } from '../../../../core/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    selectSortedCryptos,
    selectConnectionStatus,
    selectIsLoading,
    selectError,
} from '../slices/cryptoSlice';
import Text from '../../../../shared/components/Text';
import CryptoListItem from '../components/CryptoListItem';
import ConnectionStatus from '../components/ConnectionStatus';
import LoadingState from '../../../../shared/components/LoadingState';
import ErrorState from '../../../../shared/components/ErrorState';
import CryptoDetailScreen from './CryptoDetailScreen';
import { Ionicons } from '@expo/vector-icons';
import OfflineIndicator from '../../../../shared/components/OfflineIndicator';

interface CryptoDashboardScreenProps {
    onLogout?: () => void;
}

const CryptoDashboardScreen: React.FC<CryptoDashboardScreenProps> = ({ onLogout }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);

    const {
        cryptocurrencies,
        isLoading: isQueryLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: queryError,
        refetch,
    } = useCryptocurrencies();

    useWebSocketPrices();

    const connectionStatus = useAppSelector(selectConnectionStatus);
    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);

    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const filteredCryptos = useMemo(() => {
        if (!searchQuery.trim()) {
            return cryptocurrencies;
        }

        const query = searchQuery.toLowerCase();
        return cryptocurrencies.filter(
            (crypto) =>
                crypto.name.toLowerCase().includes(query) ||
                crypto.symbol.toLowerCase().includes(query),
        );
    }, [cryptocurrencies, searchQuery]);

    const keyExtractor = useCallback((item: Cryptocurrency) => item.id, []);

    const handleItemPress = useCallback((crypto: Cryptocurrency) => {
        setSelectedCrypto(crypto);
    }, []);

    const renderItem: ListRenderItem<Cryptocurrency> = useCallback(
        ({ item }) => (
            <CryptoListItem item={item} onPress={handleItemPress} />
        ),
        [handleItemPress],
    );

    const emptyComponent = useMemo(
        () => (
            <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={colors.subtext} />
                <Text variant="body" style={{ marginTop: 24, color: colors.subtext }}>
                    No cryptocurrencies found
                </Text>
            </View>
        ),
        [colors.subtext],
    );

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const renderFooter = useCallback(() => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.footerLoader}>
                <LoadingState variant="compact" />
            </View>
        );
    }, [isFetchingNextPage]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const refreshControl = useMemo(
        () => (
            <RefreshControl
                refreshing={isFetching && !isFetchingNextPage}
                onRefresh={handleRefresh}
                tintColor={colors.tint}
                title=""
                titleColor={colors.tint}
                colors={[colors.tint]}
                progressBackgroundColor={colors.card}
            />
        ),
        [isFetching, isFetchingNextPage, handleRefresh, colors.tint, colors.card],
    );

    if (selectedCrypto) {
        return <CryptoDetailScreen crypto={selectedCrypto} onBack={() => setSelectedCrypto(null)} />;
    }

    if (isQueryLoading && cryptocurrencies.length === 0) {
        return <LoadingState />;
    }

    if (queryError && cryptocurrencies.length === 0) {
        return (
            <ErrorState
                error={queryError.message || 'Failed to load cryptocurrencies'}
                onRetry={refetch}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.card,
                        paddingTop: Math.max(insets.top + 10, 32),
                    },
                ]}
            >
                <OfflineIndicator />
                <View style={styles.headerRow}>
                    <Text variant="header" style={{ color: colors.text }}>CryptoApp</Text>
                    <View style={styles.headerRight}>
                        <ConnectionStatus status={connectionStatus} />
                        {onLogout && (
                            <Ionicons
                                name="log-out-outline"
                                size={24}
                                color={colors.error}
                                onPress={onLogout}
                                style={{ marginLeft: 12 }}
                            />
                        )}
                    </View>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: colors.border }]}>
                    <Ionicons name="search" size={20} color={colors.subtext} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder=""
                        placeholderTextColor={colors.subtext}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={colors.subtext}
                            onPress={() => setSearchQuery('')}
                        />
                    )}
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <Text variant="caption">{filteredCryptos.length} cryptocurrencies</Text>
                    {error && (
                        <Text variant="caption" color="error">
                            {error}
                        </Text>
                    )}
                </View>
            </View>

            <FlashList
                data={filteredCryptos}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                refreshControl={refreshControl}
                ListEmptyComponent={emptyComponent}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                drawDistance={200}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        backgroundColor: '#1E293B',
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: '#334155',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 4,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    listContent: {
        paddingTop: 4,
        paddingBottom: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    footerLoader: {
        paddingVertical: 24,
        alignItems: 'center',
    },
});

export default CryptoDashboardScreen;
