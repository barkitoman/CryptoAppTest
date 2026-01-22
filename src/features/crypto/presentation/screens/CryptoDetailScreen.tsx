import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import { container, SERVICES } from '../../../../core/di/container';
import { GetHistoricalPricesUseCase } from '../../domain/usecases/GetHistoricalPricesUseCase';
import Text from '../../../../shared/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CryptoDetailScreenProps {
    crypto: Cryptocurrency;
    onBack: () => void;
}

const CryptoDetailScreen: React.FC<CryptoDetailScreenProps> = ({ crypto, onBack }) => {
    const [historicalData, setHistoricalData] = useState<{ timestamp: number; price: number }[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadHistoricalData();
    }, [crypto.id, days]);

    const loadHistoricalData = async () => {
        try {
            setLoading(true);
            const useCase = container.resolve<GetHistoricalPricesUseCase>(
                SERVICES.GET_HISTORICAL_PRICES_USE_CASE,
            );
            const data = await useCase.execute(crypto.id, days);
            setHistoricalData(data);
        } catch (error) {
            console.error('Error loading historical data:', error);
            const mockData = generateMockHistoricalData(crypto.priceUsd, days);
            setHistoricalData(mockData);
        } finally {
            setLoading(false);
        }
    };

    const generateMockHistoricalData = (currentPrice: number, days: number) => {
        const data: { timestamp: number; price: number }[] = [];
        const now = Date.now();
        const interval = (days * 24 * 60 * 60 * 1000) / 50;

        for (let i = 0; i < 50; i++) {
            const timestamp = now - (50 - i) * interval;
            const variation = (Math.random() - 0.5) * 0.1;
            const price = currentPrice * (1 + variation);
            data.push({ timestamp, price });
        }
        return data;
    };

    const formatPrice = (price: number) => {
        if (price < 1) {
            return `$${price.toFixed(6)}`;
        } else if (price < 100) {
            return `$${price.toFixed(2)}`;
        } else {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    const formatMarketCap = (value: number) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(0)}`;
    };

    const isPositive = crypto.changePercent24Hr >= 0;
    const screenWidth = Dimensions.get('window').width;

    // Prepare chart data
    const chartData = {
        labels:
            historicalData.length > 0
                ? historicalData
                    .filter((_, i) => i % Math.floor(historicalData.length / 6) === 0)
                    .map(() => '')
                : [''],
        datasets: [
            {
                data: historicalData.length > 0 ? historicalData.map((d) => d.price) : [0],
            },
        ],
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.card,
                        paddingTop: Math.max(insets.top + 10, 60), // Match previous style or dynamic
                    },
                ]}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={colors.text}
                    onPress={onBack}
                    style={styles.backButton}
                />
                <View style={styles.headerInfo}>
                    <Text variant="title" style={{ color: colors.text }}>{crypto.symbol}</Text>
                    <Text variant="caption" style={{ marginTop: 4, color: colors.subtext }}>
                        {crypto.name}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Price Section */}
                <View style={styles.priceSection}>
                    <Text variant="header" style={{ color: colors.text }}>{formatPrice(crypto.priceUsd)}</Text>
                    <View style={styles.changeRow}>
                        <Ionicons
                            name={isPositive ? 'arrow-up' : 'arrow-down'}
                            size={20}
                            color={isPositive ? colors.success : colors.error}
                        />
                        <Text
                            variant="title"
                            style={{
                                color: isPositive ? colors.success : colors.error,
                                marginLeft: 8,
                            }}
                        >
                            {isPositive ? '+' : ''}
                            {crypto.changePercent24Hr.toFixed(2)}%
                        </Text>
                    </View>
                </View>

                {/* Chart */}
                <View style={[styles.chartSection, { backgroundColor: colors.card }]}>
                    {loading ? (
                        <View style={styles.loadingChart}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <>
                            <LineChart
                                data={chartData}
                                width={screenWidth - 64}
                                height={220}
                                chartConfig={{
                                    backgroundColor: colors.card,
                                    backgroundGradientFrom: colors.card,
                                    backgroundGradientTo: colors.card,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                    labelColor: (opacity = 1) => colors.subtext,
                                    style: {
                                        borderRadius: 16,
                                        padding: 16,
                                    },
                                    propsForDots: {
                                        r: '4',
                                        strokeWidth: 2,
                                        stroke: colors.primary,
                                    },
                                    propsForBackgroundLines: {
                                        strokeDasharray: '',
                                        stroke: colors.border,
                                        strokeWidth: 1,
                                    },
                                }}
                                bezier
                                style={styles.chart}
                                withInnerLines={true}
                                withOuterLines={false}
                                withDots={true}
                                withShadow={false}
                                decorator={() => {
                                    return null;
                                }}
                            />
                        </>
                    )}

                    {/* Time Period Selector */}
                    <View style={styles.periodSelector}>
                        {[1, 7, 30, 90].map((period) => (
                            <View
                                key={period}
                                style={[
                                    styles.periodButton,
                                    { backgroundColor: days === period ? colors.primary : colors.border },
                                ]}
                                onTouchEnd={() => setDays(period)}
                            >
                                <Text
                                    variant="small"
                                    style={{
                                        color: days === period ? '#FFFFFF' : colors.subtext,
                                    }}
                                >
                                    {period}D
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Stats */}
                <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
                    <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                        <Text variant="caption" style={{ color: colors.subtext }}>Market Cap</Text>
                        <Text variant="body" style={{ color: colors.text }}>{formatMarketCap(crypto.marketCapUsd)}</Text>
                    </View>
                    <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                        <Text variant="caption" style={{ color: colors.subtext }}>24h Volume</Text>
                        <Text variant="body" style={{ color: colors.text }}>{formatMarketCap(crypto.volumeUsd24Hr)}</Text>
                    </View>
                    <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
                        <Text variant="caption" style={{ color: colors.subtext }}>Circulating Supply</Text>
                        <Text variant="body" style={{ color: colors.text }}>
                            {crypto.supply.toLocaleString()} {crypto.symbol}
                        </Text>
                    </View>
                    <View style={[styles.statRow, { borderBottomColor: 'transparent' }]}>
                        <Text variant="caption" style={{ color: colors.subtext }}>Rank</Text>
                        <Text variant="body" style={{ color: colors.text }}>#{crypto.rank}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    headerInfo: {
        marginLeft: 16,
    },
    content: {
        flex: 1,
    },
    priceSection: {
        padding: 24,
        alignItems: 'center',
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    chartSection: {
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        // Shadows for depth
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingChart: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    periodButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    statsSection: {
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 32,
        borderRadius: 16,
        // Shadows for depth
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
});

export default CryptoDetailScreen;
