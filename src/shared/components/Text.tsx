import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
    variant?:
    | 'header'
    | 'title'
    | 'subtitle'
    | 'body'
    | 'bodySecondary'
    | 'caption'
    | 'small'
    | 'button'
    | 'price'
    | 'priceChange';
    color?: 'textPrimary' | 'textSecondary' | 'error' | 'success' | 'priceUp' | 'priceDown';
}

const Text = React.forwardRef<RNText, TextProps>(({
    variant = 'body',
    color = 'textPrimary',
    style,
    ...props
}, ref) => {
    const variantStyle = styles[variant] || styles.body;
    const colorStyle = { color: colors[color] || colors.textPrimary };

    return <RNText ref={ref} style={[variantStyle, colorStyle, style]} {...props} />;
});

const colors = {
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    error: '#EF4444',
    success: '#10B981',
    priceUp: '#10B981',
    priceDown: '#EF4444',
};

const styles = StyleSheet.create({
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    body: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    bodySecondary: {
        fontSize: 16,
        color: '#94A3B8',
    },
    caption: {
        fontSize: 14,
        color: '#94A3B8',
    },
    small: {
        fontSize: 12,
        color: '#94A3B8',
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    priceChange: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Text;
