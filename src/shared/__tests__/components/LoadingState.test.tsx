import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingState from '../../components/LoadingState';

describe('LoadingState Component', () => {
    it('should render loading indicator', () => {
        const { container } = render(<LoadingState />);
        expect(container).toBeTruthy();
    });

    it('should render with custom message', () => {
        const { getByText } = render(<LoadingState message="Loading data..." />);
        expect(getByText('Loading data...')).toBeTruthy();
    });

    it('should render without message', () => {
        const { queryByText } = render(<LoadingState />);
        // Should not have any text when no message is provided
        expect(queryByText(/./)).toBeFalsy();
    });
});
