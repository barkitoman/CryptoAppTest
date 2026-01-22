import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Cryptocurrency } from '../../domain/entities/Cryptocurrency';
import Text from '../../../../shared/components/Text';
import PriceChangeIndicator from './PriceChangeIndicator';
import AnimatedPrice from './AnimatedPrice';
import { useTheme } from '../../../../core/theme/ThemeContext';

interface CryptoListItemProps {
    item: Cryptocurrency;
    onPress?: (crypto: Cryptocurrency) => void;
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ item, onPress }) => {
    const isPositive = item.changePercent24Hr >= 0;
    const { colors, isDark } = useTheme();

    const iconUrl = `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`;

    const gradientColors = useMemo(() => {
        return isDark ? ['#1E293B', '#0F172A'] : ['#FFFFFF', '#F1F5F9'];
    }, [isDark]);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress?.(item)}
            style={styles.container}
        >
            <LinearGradient
                colors={gradientColors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.card, { borderColor: colors.border, borderWidth: 1 }]}
            >
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Image // Aca podria usar Fast-Image
                            source={iconUrl}
                            style={styles.icon}
                            contentFit="contain"
                            transition={300}
                        />
                        <View style={[styles.rankBadge, { backgroundColor: colors.border }]}>
                            <Text variant="small" style={{ fontSize: 10, color: colors.subtext }}>
                                {item.rank}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text
                            variant="body"
                            numberOfLines={1}
                            style={{ fontWeight: '700', fontSize: 16, color: colors.text }}
                        >
                            {item.symbol}
                        </Text>
                        <Text
                            variant="caption"
                            numberOfLines={1}
                            style={{ color: colors.subtext, marginTop: 2, fontSize: 13 }}
                        >
                            {item.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <AnimatedPrice
                        price={item.priceUsd}
                        variant="price"
                        style={{ marginBottom: 6 }}
                    />

                    <View
                        style={[
                            styles.changeBadge,
                            {
                                backgroundColor: isPositive
                                    ? isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5'
                                    : isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
                            },
                        ]}
                    >
                        <PriceChangeIndicator change={item.changePercent24Hr} size={12} />
                        <Text
                            variant="small"
                            style={{
                                marginLeft: 4,
                                fontWeight: '600',
                                color: isPositive ? colors.success : colors.error,
                            }}
                        >
                            {Math.abs(item.changePercent24Hr).toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'relative',
        marginRight: 16,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    rankBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
});

export default React.memo(CryptoListItem, (prevProps, nextProps) => {
    return (
        prevProps.item.priceUsd === nextProps.item.priceUsd &&
        prevProps.item.changePercent24Hr === nextProps.item.changePercent24Hr &&
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.rank === nextProps.item.rank
    );
});
