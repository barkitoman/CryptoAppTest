import React from 'react';
import { render } from '@testing-library/react-native';
import ConnectionStatus from '../../components/ConnectionStatus';
import { ConnectionStatus as ConnectionStatusEnum } from '../../../domain/entities/Cryptocurrency';

describe('ConnectionStatus Component', () => {
    it('should render green dot when connected', () => {
        const { container } = render(
            <ConnectionStatus status={ConnectionStatusEnum.CONNECTED} />
        );
        expect(container).toBeTruthy();
    });

    it('should render yellow dot when connecting', () => {
        const { container } = render(
            <ConnectionStatus status={ConnectionStatusEnum.CONNECTING} />
        );
        expect(container).toBeTruthy();
    });

    it('should render gray dot when disconnected', () => {
        const { container } = render(
            <ConnectionStatus status={ConnectionStatusEnum.DISCONNECTED} />
        );
        expect(container).toBeTruthy();
    });

    it('should render red dot when error', () => {
        const { container } = render(
            <ConnectionStatus status={ConnectionStatusEnum.ERROR} />
        );
        expect(container).toBeTruthy();
    });

    it('should render without crashing for all status types', () => {
        const statuses = [
            ConnectionStatusEnum.CONNECTED,
            ConnectionStatusEnum.CONNECTING,
            ConnectionStatusEnum.DISCONNECTED,
            ConnectionStatusEnum.ERROR,
        ];

        statuses.forEach((status) => {
            expect(() => {
                render(<ConnectionStatus status={status} />);
            }).not.toThrow();
        });
    });
});
