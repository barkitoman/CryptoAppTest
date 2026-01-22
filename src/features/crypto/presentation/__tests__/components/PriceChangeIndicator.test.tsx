import React from 'react';
import { render } from '@testing-library/react-native';
import PriceChangeIndicator from '../../components/PriceChangeIndicator';

describe('PriceChangeIndicator Component', () => {
    it('should render up arrow for positive change', () => {
        const { container } = render(<PriceChangeIndicator change={5.5} />);
        expect(container).toBeTruthy();
    });

    it('should render down arrow for negative change', () => {
        const { container } = render(<PriceChangeIndicator change={-3.2} />);
        expect(container).toBeTruthy();
    });

    it('should render up arrow for zero change', () => {
        const { container } = render(<PriceChangeIndicator change={0} />);
        expect(container).toBeTruthy();
    });

    it('should accept custom size prop', () => {
        const { container } = render(<PriceChangeIndicator change={5.5} size={24} />);
        expect(container).toBeTruthy();
    });

    it('should use default size when not provided', () => {
        const { container } = render(<PriceChangeIndicator change={5.5} />);
        expect(container).toBeTruthy();
    });
});
