import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingState from '../../components/LoadingState';

describe('LoadingState Component', () => {
    it('should render loading indicator', () => {
        const { toJSON } = render(<LoadingState />);
        expect(toJSON()).toBeTruthy();
    });

    it('should render loading message', () => {
        const { getByText } = render(<LoadingState />);
        expect(getByText('Loading cryptocurrencies...')).toBeTruthy();
    });

    it('should rendert compact variant without text', () => {
        const { queryByText } = render(<LoadingState variant="compact" />);
        expect(queryByText(/./)).toBeFalsy();
    });
});
