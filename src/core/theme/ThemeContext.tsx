import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from './colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = React.useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

    // Update theme when system scheme changes
    React.useEffect(() => {
        const newTheme = systemScheme === 'dark' ? 'dark' : 'light';
        setTheme(newTheme);
    }, [systemScheme]);

    const value = {
        theme,
        colors: colors[theme],
        isDark: theme === 'dark',
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
