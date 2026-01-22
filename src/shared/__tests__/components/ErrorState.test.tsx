import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorState from '../../components/ErrorState';

describe('ErrorState Component', () => {
    it('should render error message', () => {
        const { getByText } = render(<ErrorState message="Something went wrong" />);
        expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should render retry button when onRetry is provided', () => {
        const mockRetry = jest.fn();
        const { getByText } = render(
            <ErrorState message="Error occurred" onRetry={mockRetry} />
        );

        expect(getByText('Try Again')).toBeTruthy();
    });

    it('should call onRetry when retry button is pressed', () => {
        const mockRetry = jest.fn();
        const { getByText } = render(
            <ErrorState message="Error occurred" onRetry={mockRetry} />
        );

        fireEvent.press(getByText('Try Again'));
        expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('should not render retry button when onRetry is not provided', () => {
        const { queryByText } = render(<ErrorState message="Error occurred" />);
        expect(queryByText('Try Again')).toBeFalsy();
    });
});
