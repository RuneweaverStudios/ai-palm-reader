import 'dotenv/config';
console.log('OPENAI_API_KEY from .env:', process.env.OPENAI_API_KEY);

export default {
  expo: {
    name: 'Palm Reader',
    slug: 'palm-reader',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/your-project-id',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.palmreader',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#FFFFFF',
      },
      package: 'com.yourcompany.palmreader',
    },
    plugins: [
      'expo-camera',
      'expo-image-picker',
    ],
    newArchEnabled: true,
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
}; 