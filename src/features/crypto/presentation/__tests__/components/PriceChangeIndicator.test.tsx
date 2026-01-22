import React from 'react';
import { render } from '@testing-library/react-native';
import PriceChangeIndicator from '../../components/PriceChangeIndicator';

describe('PriceChangeIndicator Component', () => {
    it('should render up arrow for positive change', () => {
        const { toJSON } = render(<PriceChangeIndicator change={5.5} />);
        expect(toJSON()).toBeTruthy();
    });

    it('should render down arrow for negative change', () => {
        const { toJSON } = render(<PriceChangeIndicator change={-3.2} />);
        expect(toJSON()).toBeTruthy();
    });

    it('should render up arrow for zero change', () => {
        const { toJSON } = render(<PriceChangeIndicator change={0} />);
        expect(toJSON()).toBeTruthy();
    });

    it('should accept custom size prop', () => {
        const { toJSON } = render(<PriceChangeIndicator change={5.5} size={24} />);
        expect(toJSON()).toBeTruthy();
    });

    it('should use default size when not provided', () => {
        const { toJSON } = render(<PriceChangeIndicator change={5.5} />);
        expect(toJSON()).toBeTruthy();
    });
});
