import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import { setupDependencies } from './src/core/di/setup';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/core/theme/ThemeContext';

const ThemedStatusBar: React.FC = () => {
  const { isDark, colors } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 3,
      retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: 'always',
      networkMode: 'offlineFirst',
    },
  },
});


const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'CRYPTO_APP_CACHE',
  throttleTime: 1000,
});

export default function App() {
  useEffect(() => {
    setupDependencies();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <SafeAreaProvider>
            <ThemeProvider>
              <ThemedStatusBar />
              <AppNavigator />
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </Provider>
    </View>
  );
}
