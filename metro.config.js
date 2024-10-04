import {getDefaultConfig, mergeConfig} from '@react-native/metro-config';

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// Export the configuration using ES module syntax
export default mergeConfig(getDefaultConfig(__dirname), config);
