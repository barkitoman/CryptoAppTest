import React from 'react';
import { render } from '@testing-library/react-native';
import Text from '../../components/Text';

describe('Text Component', () => {
    it('should render with default variant', () => {
        const { getByText } = render(<Text>Hello World</Text>);
        expect(getByText('Hello World')).toBeTruthy();
    });

    it('should render with header variant', () => {
        const { getByText } = render(<Text variant="header">Header Text</Text>);
        expect(getByText('Header Text')).toBeTruthy();
    });

    it('should render with subtitle variant', () => {
        const { getByText } = render(<Text variant="subtitle">Subtitle Text</Text>);
        expect(getByText('Subtitle Text')).toBeTruthy();
    });

    it('should render with body variant', () => {
        const { getByText } = render(<Text variant="body">Body Text</Text>);
        expect(getByText('Body Text')).toBeTruthy();
    });

    it('should render with caption variant', () => {
        const { getByText } = render(<Text variant="caption">Caption Text</Text>);
        expect(getByText('Caption Text')).toBeTruthy();
    });

    it('should render with price variant', () => {
        const { getByText } = render(<Text variant="price">$50,000</Text>);
        expect(getByText('$50,000')).toBeTruthy();
    });

    it('should apply custom styles', () => {
        const { getByText } = render(
            <Text style={{ color: 'red' }}>Styled Text</Text>
        );
        const textElement = getByText('Styled Text');
        expect(textElement.props.style).toMatchObject(
            expect.arrayContaining([expect.objectContaining({ color: 'red' })])
        );
    });

    it('should accept all Text props', () => {
        const { getByText } = render(
            <Text numberOfLines={1} ellipsizeMode="tail">
                Long text that should be truncated
            </Text>
        );
        expect(getByText('Long text that should be truncated')).toBeTruthy();
    });
});
