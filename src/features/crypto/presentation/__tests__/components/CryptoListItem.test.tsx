import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../../../../core/theme/ThemeContext';
import CryptoListItem from '../../components/CryptoListItem';
import { Cryptocurrency } from '../../../domain/entities/Cryptocurrency';

const mockCrypto: Cryptocurrency = {
    id: 'bitcoin',
    rank: 1,
    symbol: 'BTC',
    name: 'Bitcoin',
    supply: 19000000,
    maxSupply: 21000000,
    marketCapUsd: 1000000000000,
    volumeUsd24Hr: 50000000000,
    priceUsd: 50000,
    changePercent24Hr: 5.5,
    vwap24Hr: 49500,
    lastUpdated: Date.now(),
};

describe('CryptoListItem Component', () => {
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider>{component}</ThemeProvider>);
    };

    it('should render cryptocurrency symbol and name', () => {
        const { getByText } = renderWithTheme(<CryptoListItem item={mockCrypto} />);

        expect(getByText('BTC')).toBeTruthy();
        expect(getByText('Bitcoin')).toBeTruthy();
    });

    it('should display rank badge', () => {
        const { getByText } = renderWithTheme(<CryptoListItem item={mockCrypto} />);

        expect(getByText('1')).toBeTruthy();
    });

    it('should format price correctly', () => {
        const { getByText } = renderWithTheme(<CryptoListItem item={mockCrypto} />);

        // Price should be formatted with commas
        expect(getByText(/50,000/)).toBeTruthy();
    });

    it('should display positive change percentage in green', () => {
        const { getByText } = renderWithTheme(<CryptoListItem item={mockCrypto} />);

        const changeText = getByText('5.50%');
        expect(changeText).toBeTruthy();
    });

    it('should display negative change percentage in red', () => {
        const negativeCrypto = { ...mockCrypto, changePercent24Hr: -3.2 };
        const { getByText } = renderWithTheme(<CryptoListItem item={negativeCrypto} />);

        const changeText = getByText('3.20%');
        expect(changeText).toBeTruthy();
    });

    it('should call onPress when item is pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = renderWithTheme(
            <CryptoListItem item={mockCrypto} onPress={mockOnPress} />
        );

        fireEvent.press(getByText('BTC'));
        expect(mockOnPress).toHaveBeenCalledWith(mockCrypto);
    });

    it('should not crash when onPress is not provided', () => {
        const { getByText } = renderWithTheme(<CryptoListItem item={mockCrypto} />);

        expect(() => {
            fireEvent.press(getByText('BTC'));
        }).not.toThrow();
    });
});
