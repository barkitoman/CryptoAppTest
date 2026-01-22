import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../../../core/theme/ThemeContext';
import AnimatedPrice from '../../components/AnimatedPrice';

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(() => 'light'),
}));

describe('AnimatedPrice Component', () => {
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider>{component}</ThemeProvider>);
    };

    it('should render price correctly', () => {
        renderWithTheme(<AnimatedPrice price={50000.123} variant="price" />);

        expect(screen.getByText(/50,000.12/)).toBeTruthy();
    });

    it('should format small prices with more decimals', () => {
        renderWithTheme(<AnimatedPrice price={0.123456} variant="price" />);

        expect(screen.getByText(/\$0.123456/)).toBeTruthy();
    });

    it('should format large prices with commas', () => {
        renderWithTheme(<AnimatedPrice price={1234567.89} variant="price" />);

        expect(screen.getByText(/1,234,567.89/)).toBeTruthy();
    });

    it('should apply custom styles', () => {
        const { getByText } = renderWithTheme(
            <AnimatedPrice
                price={100}
                variant="price"
                style={{ fontSize: 24 }}
            />
        );

        const priceElement = getByText(/100.00/);
        expect(priceElement.props.style).toMatchObject(
            expect.arrayContaining([
                expect.objectContaining({ fontSize: 24 })
            ])
        );
    });
});
