import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ViewStyle, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { IconProps } from 'react-native-vector-icons/Icon';
import type { ComponentType } from 'react';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';

const IonIcon = Ionicons as unknown as ComponentType<IconProps>;

type ERImageUploaderProps = {
  value?: string | null; // ✅ 현재 이미지 URI
  onChange: (uri: string | null) => void; // ✅ 선택된 이미지 URI 전달
  placeholderText?: string; // ✅ 빈 상태 문구
  containerStyle?: ViewStyle; // ✅ 외부 스타일 확장
  maxSize?: number; // ✅ 너무 커지는걸 방지 (기본 260)
};

const ERImageUploaderBase: React.FC<ERImageUploaderProps> = ({
  value,
  onChange,
  placeholderText = '운동 이미지를\n첨부해 주세요',
  containerStyle,
  maxSize = 260,
}) => {
  const { theme } = useTheme();

  const pickImage = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert('이미지 선택 실패', result.errorMessage ?? '잠시 후 다시 시도해주세요.');
      return;
    }

    const asset: Asset | undefined = result.assets?.[0];
    const uri = asset?.uri ?? null;

    if (!uri) {
      Alert.alert('이미지 선택 실패', '선택한 이미지 URI를 불러오지 못했습니다.');
      return;
    }

    onChange(uri);
  }, [onChange]);

  return (
    <View style={[styles.wrapper, { maxWidth: maxSize }, containerStyle]}>
      <Pressable
        onPress={pickImage}
        style={[
          styles.squareBox,
          {
            borderColor: theme.colors.gray4,
            backgroundColor: theme.colors.white1,
          },
        ]}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholderCenter}>
            <IonIcon name="image-outline" size={48} color={theme.colors.gray4} />
            <View style={{ height: 14 }} />
            <Text style={[styles.placeholderText, { color: theme.colors.gray4 }]}>
              {placeholderText}
            </Text>
          </View>
        )}

        {/* ✅ 우하단 카메라 라벨 */}
        <View
          style={[
            styles.cameraBadge,
            {
              backgroundColor: theme.colors.white1,
              borderColor: theme.colors.gray4,
            },
          ]}
        >
          <IonIcon name="camera-outline" size={18} color={theme.colors.gray3} />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(ERImageUploaderBase);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ✅ 정사각형 박스 (피그마 느낌)
  squareBox: {
    width: '80%',
    aspectRatio: 1,
    borderWidth: 1.4,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  // ✅ 빈 상태 가운데 정렬
  placeholderCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ✅ 이미지 미리보기
  imagePreview: {
    width: '100%',
    height: '100%',
  },

  // ✅ 우하단 카메라 badge (피그마 느낌)
  cameraBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',

    // ✅ iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // ✅ Android shadow
    elevation: 4,
  },
});
