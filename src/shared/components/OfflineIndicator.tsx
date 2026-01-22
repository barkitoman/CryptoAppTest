import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Text from './Text';
import { useTheme } from '../../core/theme/ThemeContext';

const OfflineIndicator: React.FC = () => {
    const { colors } = useTheme();
    const [isOffline, setIsOffline] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updateConnectivity = (state: any) => {
            // RELAXED LOGIC: Only consider offline if isConnected is specifically false.
            // isInternetReachable is often flakey in emulators/dev environments.
            const offline = state.isConnected === false;

            console.log(`[OfflineIndicator] Connectivity update: isConnected=${state.isConnected}, isInternetReachable=${state.isInternetReachable} -> Showing Indicator? ${offline}`);

            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            if (offline) {
                // Wait 2 seconds before showing the offline indicator
                debounceTimer.current = setTimeout(() => {
                    setIsOffline(true);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }).start();
                }, 2000);
            } else {
                // Immediately hide when online
                setIsOffline(false);
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        };

        const unsubscribe = NetInfo.addEventListener(updateConnectivity);
        NetInfo.fetch().then(updateConnectivity);

        return () => {
            unsubscribe();
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [fadeAnim]);

    if (!isOffline) return null;

    return (
        <Animated.View
            style={[
                styles.floatingContainer,
                {
                    opacity: fadeAnim,
                    transform: [
                        {
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={[styles.pill, { backgroundColor: 'rgba(239, 68, 68, 0.9)' }]}>
                <View style={styles.dot} />
                <Text variant="caption" style={styles.text}>
                    Modo Offline • Datos en Cache
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        top: 100, // Below the header but floating
        alignSelf: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 11,
    },
});

export default OfflineIndicator;
