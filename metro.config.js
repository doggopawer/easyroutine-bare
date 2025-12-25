// metro.config.js
// 기능: SVG 파일을 컴포넌트처럼 import 하기 위한 transformer 설정 + projectRoot 강제 지정

const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// ✅ 반드시 프로젝트 루트로 고정
const projectRoot = path.resolve(__dirname);

// ✅ 기본 설정 가져오기 (루트 기준)
const defaultConfig = getDefaultConfig(projectRoot);

// ✅ transformer 설정 추가
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// ✅ svg를 asset이 아닌 source로 취급하도록 resolver 조정
defaultConfig.resolver = {
  ...defaultConfig.resolver,
  assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
};

// ✅ projectRoot, watchFolders를 명시해서 ios 기준으로 쏠리는 현상 방지
module.exports = mergeConfig(defaultConfig, {
  projectRoot,
  watchFolders: [projectRoot],
});
