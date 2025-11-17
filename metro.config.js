// metro.config.js
// 기능: SVG 파일을 컴포넌트처럼 import 하기 위한 transformer 설정
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// transformer 설정 추가
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// svg를 asset이 아닌 source로 취급하도록 resolver 조정
defaultConfig.resolver = {
  ...defaultConfig.resolver,
  assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
};

module.exports = mergeConfig(defaultConfig, {});