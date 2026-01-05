// 파일: shared/headful/ERCheckbox/ERCheckboxItem.tsx
// 목적: ERCheckbox.Item
// - ManySelect.Item 기반
// - variant별 UI 분기
// - 현재는 image-text variant만 지원
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
};

const ERCheckboxItemBase: React.FC<ERCheckboxItemProps> = ({
  value,
  title,
  imageSrc,
  disabled,
}) => {
  const { theme } = useTheme();
  const { variant } = useERCheckboxContext();

  const store = useManySelectStoreContext();
  const active = useManySelectStore(store, s => s.isSelected(value));

  const rowStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                         ✅ 현재는 image-text만 구현                          */
  /* -------------------------------------------------------------------------- */

  if (variant !== 'image-text') return null;

  return (
    <ManySelect.Item value={value} disabled={disabled}>
      <View style={[styles.row, rowStyle]}>
        {/* ✅ 썸네일 */}
        <View style={styles.imageBox}>
          {imageSrc ? (
            <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />
          ) : null}
        </View>

        {/* ✅ 텍스트 */}
        <View style={styles.center}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* ✅ 체크박스 */}
        <View style={styles.right}>
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
};

export default memo(ERCheckboxItemBase);

const styles = StyleSheet.create({
  row: {
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

  center: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
    minWidth: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  right: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ✅ 체크박스 UI */
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
