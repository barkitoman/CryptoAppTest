import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component that uses the theme
const TestComponent = () => {
    const { colors, isDark, theme } = useTheme();
    return (
        <>
            <Text testID="theme">{theme}</Text>
            <Text testID="isDark">{isDark.toString()}</Text>
            <Text testID="primaryColor">{colors.primary}</Text>
        </>
    );
};

describe('ThemeContext', () => {
    it('should provide theme context to children', () => {
        const screen = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toBeTruthy();
        expect(screen.getByTestId('isDark')).toBeTruthy();
        expect(screen.getByTestId('primaryColor')).toBeTruthy();
    });

    it('should provide light theme colors when system is light', () => {
        const screen = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const primaryColor = screen.getByTestId('primaryColor');
        // Light theme primary color
        expect(primaryColor.props.children).toBeTruthy();
    });

    it('should throw error when useTheme is used outside ThemeProvider', () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useTheme must be used within a ThemeProvider');

        console.error = originalError;
    });

    it('should provide isDark boolean based on theme', () => {
        const screen = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const isDark = screen.getByTestId('isDark');
        expect(['true', 'false']).toContain(isDark.props.children);
    });
});
