import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomRefreshControlProps {
    refreshing: boolean;
}

const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({ refreshing }) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (refreshing) {
            // Rotation animation
            Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ).start();

            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            rotation.setValue(0);
            scale.setValue(1);
        }
    }, [refreshing]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (!refreshing) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            <View style={styles.background}>
                <Animated.View
                    style={{
                        transform: [{ rotate: rotateInterpolate }, { scale: scale }],
                    }}
                >
                    <Ionicons name="sync" size={24} color="#3B82F6" />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
        marginTop: 8,
    },
    background: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default CustomRefreshControl;
