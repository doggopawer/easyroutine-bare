// 파일: shared/headful/ERCheckbox/ERCheckboxItem.tsx
// 목적: ERCheckbox.Item
// - ManySelect.Item 기반
// - variant별 UI 분기
// - image-text / text 지원
// - 체크 표시를 체크박스로 표현

import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import ManySelect from '@/headless/ManySelect/ManySelect';
import {
  useManySelectStore,
  useManySelectStoreContext,
} from '@/headless/ManySelect/ManySelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { IconProps } from 'react-native-vector-icons/Icon';
import type { ComponentType } from 'react';

import { useERCheckboxContext } from './ERCheckbox';

const IonIcon = Ionicons as unknown as ComponentType<IconProps>;

type ERCheckboxItemProps = {
  value: string;
  title: string;
  imageSrc?: string;
  disabled?: boolean;

  // ✅ text variant 전용
  containerStyle?: ViewStyle;
};

const ERCheckboxItemBase: React.FC<ERCheckboxItemProps> = ({
  value,
  title,
  imageSrc,
  disabled,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { variant } = useERCheckboxContext();

  const store = useManySelectStoreContext();
  const active = useManySelectStore(store, s => s.isSelected(value));

  const opacityStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                         ✅ image-text variant                               */
  /* -------------------------------------------------------------------------- */

  if (variant === 'image-text') {
    return (
      <ManySelect.Item value={value} disabled={disabled}>
        <View style={[styles.imageTextRow, opacityStyle]}>
          {/* ✅ 썸네일 */}
          <View style={styles.imageBox}>
            {imageSrc ? (
              <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />
            ) : null}
          </View>

          {/* ✅ 텍스트 */}
          <View style={styles.imageTextCenter}>
            <Text style={[styles.imageTextTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* ✅ 체크박스 */}
          <View style={styles.imageTextRight}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: active ? theme.colors.primary1 : theme.colors.gray4,
                  backgroundColor: active ? theme.colors.primary1 : 'transparent',
                },
              ]}
            >
              {active ? <IonIcon name="checkmark" size={16} color={theme.colors.white1} /> : null}
            </View>
          </View>
        </View>
      </ManySelect.Item>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              ✅ text variant                                */
  /* -------------------------------------------------------------------------- */

  if (variant === 'text') {
    return (
      <ManySelect.Item value={value} disabled={disabled}>
        <View style={[styles.textRow, opacityStyle, containerStyle]}>
          {/* ✅ 체크박스 */}
          <View
            style={[
              styles.textCheckbox,
              {
                borderColor: active ? theme.colors.primary1 : theme.colors.gray4,
                backgroundColor: active ? theme.colors.primary1 : 'transparent',
              },
            ]}
          >
            {active ? <IonIcon name="checkmark" size={14} color={theme.colors.white1} /> : null}
          </View>

          {/* ✅ 텍스트 */}
          <Text style={[styles.textTitle, { color: theme.colors.text }]}>{title}</Text>
        </View>
      </ManySelect.Item>
    );
  }

  return null;
};

export default memo(ERCheckboxItemBase);

const styles = StyleSheet.create({
  /* -------------------------------------------------------------------------- */
  /*                               IMAGE-TEXT                                   */
  /* -------------------------------------------------------------------------- */
  imageTextRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },

  imageBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageTextCenter: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
    minWidth: 0,
  },

  imageTextTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  imageTextRight: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* -------------------------------------------------------------------------- */
  /*                                  TEXT                                      */
  /* -------------------------------------------------------------------------- */
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  textCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
});
