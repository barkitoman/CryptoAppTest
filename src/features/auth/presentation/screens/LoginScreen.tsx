import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../../../../shared/components/Text';
import { useAuth } from '../hooks/useAuth';

interface LoginScreenProps {
    navigation: any;
    onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
    const [email, setEmail] = useState('demo@crypto.com');
    const [password, setPassword] = useState('demo123');
    const { login, isLoading, error, user } = useAuth();

    useEffect(() => {
        if (user) {
            onLoginSuccess();
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            await login({ email, password });
        } catch (err) {
            // Error is handled by the hook
        }
    };

    return (
        <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text variant="caption" style={styles.label}>
                                Email
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#64748B"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!isLoading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text variant="caption" style={styles.label}>
                                Password
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#64748B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        </View>

                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>❌ {error}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 36,
        marginBottom: 8,
    },
    subtitle: {
        color: '#94A3B8',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        color: '#CBD5E1',
    },
    input: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#334155',
    },
    errorContainer: {
        backgroundColor: '#7F1D1D',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#FCA5A5',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#94A3B8',
    },
    link: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    demoInfo: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#1E293B',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    demoText: {
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
});
