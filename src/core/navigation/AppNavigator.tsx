import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../../features/auth/presentation/screens/LoginScreen';
import CryptoDashboardScreen from '../../features/crypto/presentation/screens/CryptoDashboardScreen';
import { container, SERVICES } from '../di/container';
import { GetCurrentUserUseCase } from '../../features/auth/domain/usecases/GetCurrentUserUseCase';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const getUserUseCase = container.resolve<GetCurrentUserUseCase>(
                SERVICES.GET_CURRENT_USER_USE_CASE,
            );
            const user = await getUserUseCase.execute();
            setIsAuthenticated(user !== null);
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#0F172A',
                }}
            >
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login">
                            {(props) => (
                                <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
                            )}
                        </Stack.Screen>
                    </>
                ) : (
                    <Stack.Screen name="Dashboard">
                        {(props) => <CryptoDashboardScreen {...props} onLogout={handleLogout} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
