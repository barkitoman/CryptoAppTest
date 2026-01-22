import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />

            <Text variant="title" style={{ marginTop: 24, textAlign: 'center' }}>
                Oops! Something went wrong
            </Text>

            <Text variant="body" style={{ marginTop: 16, textAlign: 'center', color: '#94A3B8' }}>
                {error}
            </Text>

            {onRetry && (
                <TouchableOpacity onPress={onRetry} style={styles.button}>
                    <Text variant="button">Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    button: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 24,
    },
});

export default ErrorState;
