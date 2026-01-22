import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ConnectionStatus as ConnectionStatusEnum } from '../../domain/entities/Cryptocurrency';

interface ConnectionStatusProps {
    status: ConnectionStatusEnum;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case ConnectionStatusEnum.CONNECTED:
                return {
                    color: '#10B981',
                };
            case ConnectionStatusEnum.CONNECTING:
                return {
                    color: '#F59E0B',
                };
            case ConnectionStatusEnum.DISCONNECTED:
                return {
                    color: '#94A3B8',
                };
            case ConnectionStatusEnum.ERROR:
                return {
                    color: '#EF4444',
                };
            default:
                return {
                    color: '#94A3B8',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View style={styles.container}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
});

export default React.memo(ConnectionStatus);
