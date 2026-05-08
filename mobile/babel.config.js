module.exports = function (api) {
  api.cache(true);
  const plugins = [];
  if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
  }
  // Doit rester en dernier (requis par react-native-reanimated).
  plugins.push('react-native-reanimated/plugin');
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
