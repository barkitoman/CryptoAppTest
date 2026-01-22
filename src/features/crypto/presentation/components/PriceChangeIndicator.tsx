import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PriceChangeIndicatorProps {
    change: number;
    size?: number;
}

const PriceChangeIndicator: React.FC<PriceChangeIndicatorProps> = ({ change, size = 14 }) => {
    const isPositive = change >= 0;
    const color = isPositive ? '#10B981' : '#EF4444';

    return (
        <View style={[styles.container, { width: size + 2, height: size + 2 }]}>
            <Ionicons name={isPositive ? 'arrow-up' : 'arrow-down'} size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(PriceChangeIndicator);
