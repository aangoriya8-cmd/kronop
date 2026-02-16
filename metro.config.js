const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for spaces in folder names
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
];

module.exports = config;
