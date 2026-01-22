import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Text from '../../../../shared/components/Text';
import { useTheme } from '../../../../core/theme/ThemeContext';

const AnimatedCustomText = Animated.createAnimatedComponent(Text);

interface AnimatedPriceProps {
    price: number;
    variant?: 'price' | 'body';
    style?: any;
}

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ price, variant = 'price', style }) => {
    const { colors } = useTheme();
    const scale = useRef(new Animated.Value(1)).current;
    const colorAnim = useRef(new Animated.Value(0)).current; // -1: red, 0: normal, 1: green
    const prevPrice = useRef<number>(price);

    useEffect(() => {
        if (prevPrice.current !== price) {
            const isUp = price > prevPrice.current;

            colorAnim.setValue(isUp ? 1 : -1);

            Animated.parallel([
                Animated.sequence([
                    Animated.spring(scale, {
                        toValue: 1.1,
                        friction: 4,
                        tension: 40,
                        useNativeDriver: false,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        friction: 4,
                        tension: 40,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.timing(colorAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ]).start();

            prevPrice.current = price;
        }
    }, [price]);

    const formatPrice = (value: number) => {
        if (value < 1) {
            return `$${value.toFixed(6)}`;
        } else if (value < 100) {
            return `$${value.toFixed(2)}`;
        } else {
            return `$${value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
    };

    const textColor = colorAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [colors.error, colors.text, colors.success],
    });

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <AnimatedCustomText
                variant={variant}
                style={[style, { color: textColor, fontWeight: '600' }]}
            >
                {formatPrice(price)}
            </AnimatedCustomText>
        </Animated.View>
    );
};

export default AnimatedPrice;
