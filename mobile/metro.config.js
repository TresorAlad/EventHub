// Compatibilité Firebase JS SDK + Metro (évite « Component auth has not been registered yet »).
// Voir https://github.com/expo/expo/issues/36588
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
