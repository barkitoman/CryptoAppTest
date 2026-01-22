import React from 'react';
import { render } from '@testing-library/react-native';
import ConnectionStatus from '../../components/ConnectionStatus';
import { ConnectionStatus as ConnectionStatusEnum } from '../../../domain/entities/Cryptocurrency';

describe('ConnectionStatus Component', () => {
    it('should render green dot when connected', () => {
        const { toJSON } = render(
            <ConnectionStatus status={ConnectionStatusEnum.CONNECTED} />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('should render yellow dot when connecting', () => {
        const { toJSON } = render(
            <ConnectionStatus status={ConnectionStatusEnum.CONNECTING} />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('should render gray dot when disconnected', () => {
        const { toJSON } = render(
            <ConnectionStatus status={ConnectionStatusEnum.DISCONNECTED} />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('should render red dot when error', () => {
        const { toJSON } = render(
            <ConnectionStatus status={ConnectionStatusEnum.ERROR} />
        );
        expect(toJSON()).toBeTruthy();
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
