import Constants from 'expo-constants';

export const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.OPENAI_API_KEY ||
  Constants.manifest?.extra?.OPENAI_API_KEY ||
  '';
// ... existing code ... 