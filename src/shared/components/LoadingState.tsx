import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Text from './Text';

const LoadingState: React.FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text variant="body" style={{ marginTop: 24, color: '#94A3B8' }}>
                Loading cryptocurrencies...
            </Text>

            {/* Skeleton loaders */}
            <View style={styles.skeletonContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <View key={index} style={styles.skeleton}>
                        <View style={styles.skeletonBox} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonContainer: {
        width: '90%',
        marginTop: 48,
    },
    skeleton: {
        width: '100%',
        opacity: 0.5,
    },
    skeletonBox: {
        height: 70,
        backgroundColor: '#1E293B',
        borderRadius: 12,
        marginBottom: 8,
    },
});

export default LoadingState;
