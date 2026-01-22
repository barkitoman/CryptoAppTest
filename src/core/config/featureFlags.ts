import { env } from './env';

/**
 * Feature Flag system to toggle functionality at runtime
 */

export type FeatureFlag = keyof typeof env.FEATURES;

/**
 * Checks if a specific feature is enabled in the current environment
 */
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
    return env.FEATURES[feature] === true;
};

/**
 * Executes a callback if a feature is enabled
 */
export const withFeature = <T>(feature: FeatureFlag, callback: () => T, fallback?: () => T): T | undefined => {
    if (isFeatureEnabled(feature)) {
        return callback();
    }
    return fallback?.();
};
