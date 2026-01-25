// 파일: shared/headful/ERTab/ERTabItem.tsx
// 목적: ERTab.Item
// - Select.Item 기반
// - variant별 UI 분기 (chip / color / icon / line / image-text / image-text-arrow)
// - active 여부는 zustand selector로 최소 구독

import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import Select from '@/headless/Select/Select';
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { useERTabContext } from './ERTab';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';
import type { ComponentType } from 'react';

const IonIcon = Ionicons as unknown as ComponentType<IconProps>;

type ERTabItemProps = {
  value: string; // ✅ Select value
  label?: string; // ✅ chip용 label
  children?: React.ReactNode; // ✅ icon/line용 children
  disabled?: boolean; // ✅ 비활성화
  accessibilityLabel?: string; // ✅ 접근성 라벨
  isLast?: boolean; // ✅ chip 마지막 margin 제거
  onTabItemPress?: (value: string) => void; // ✅ 외부 클릭 핸들러

  // ✅ image-text variant 전용
  title?: string; // ✅ 텍스트 타이틀
  imageSrc?: string; // ✅ 썸네일
};

const ERTabItemBase: React.FC<ERTabItemProps> = ({
  value,
  label,
  children,
  disabled,
  accessibilityLabel,
  isLast = false,
  onTabItemPress,

  title,
  imageSrc,
}) => {
  const { theme } = useTheme();
  const store = useSelectStoreContext();
  const active = useSelectStore(store, s => s.isSelected(value));
  const { variant } = useERTabContext();

  const press = useCallback(
    (v: string) => {
      onTabItemPress?.(v);
    },
    [onTabItemPress]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ CHIP 스타일                                */
  /* -------------------------------------------------------------------------- */

  const chipStyle: ViewStyle = useMemo(
    () => ({
      borderColor: active ? theme.colors.primary1 : theme.colors.gray4,
      backgroundColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
      marginRight: isLast ? 0 : 10,
    }),
    [active, theme.colors.primary1, theme.colors.gray4, disabled, isLast]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ COLOR 스타일                               */
  /* -------------------------------------------------------------------------- */

  const colorBg = useMemo(() => {
    if (variant !== 'color') return '#999999';
    switch (value) {
      case 'VIOLET':
        return '#855cf8';
      case 'ORANGE':
        return '#f26b2c';
      case 'GREEN':
        return '#2daf2d';
      case 'BLUE':
        return '#455a64';
      case 'PINK':
        return '#dd408f';
      default:
        return '#999999';
    }
  }, [value, variant]);

  const dotStyle: ViewStyle = useMemo(
    () => ({
      backgroundColor: colorBg,
      borderWidth: active ? 5 : 0,
      borderColor: theme.colors.primary1,
      opacity: disabled ? 0.5 : 1,
    }),
    [colorBg, active, theme.colors.primary1, disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ ICON 스타일                                */
  /* -------------------------------------------------------------------------- */

  const iconStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
      flex: 1,
    }),
    [disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ LINE 스타일                                */
  /* -------------------------------------------------------------------------- */

  const lineStyle: ViewStyle = useMemo(
    () => ({
      borderBottomColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
    }),
    [active, theme.colors.primary1, disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ IMAGE-TEXT 스타일                           */
  /* -------------------------------------------------------------------------- */

  const imageTextRowStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled]
  );

  const isImageTextVariant = variant === 'image-text' || variant === 'image-text-arrow';

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label ?? title}
      onPress={press}
      style={variant === 'icon' ? { flex: 1 } : undefined}
    >
      {/* ✅ CHIP */}
      {variant === 'chip' && (
        <View style={[styles.chipContainer, chipStyle]}>
          <Text
            style={[
              styles.chipText,
              {
                fontWeight: active ? 'bold' : '400',
                color: active ? theme.colors.white1 : theme.colors.textMuted,
              },
            ]}
          >
            {label ?? (typeof children === 'string' ? children : value)}
          </Text>
        </View>
      )}

      {/* ✅ COLOR */}
      {variant === 'color' && <View style={[styles.colorDot, dotStyle]} />}

      {/* ✅ ICON */}
      {variant === 'icon' && (
        <View style={[styles.iconColumn, iconStyle]}>
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.iconText,
                {
                  fontWeight: active ? '700' : '400',
                  color: active ? theme.colors.primary1 : theme.colors.gray3,
                },
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}

      {/* ✅ LINE */}
      {variant === 'line' && (
        <View style={[styles.lineArea, lineStyle]}>
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.lineText,
                {
                  fontWeight: active ? '700' : '400',
                  color: active ? theme.colors.primary1 : theme.colors.text,
                },
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}

      {/* ✅ IMAGE-TEXT / IMAGE-TEXT-ARROW */}
      {isImageTextVariant && (
        <View style={[styles.imageTextRow, imageTextRowStyle]}>
          {/* ✅ 썸네일 */}
          <View style={styles.imageBox}>
            {imageSrc ? (
              <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="contain" />
            ) : null}
          </View>

          {/* ✅ 텍스트 */}
          <View style={styles.imageTextCenter}>
            <Text style={[styles.imageTextTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {title ?? value}
            </Text>
          </View>

          {/* ✅ 오른쪽 아이콘 */}
          <View style={styles.imageTextRight}>
            {variant === 'image-text' ? (
              active ? (
                <IonIcon name="checkmark" size={26} color={theme.colors.primary1} />
              ) : (
                <View style={{ width: 26, height: 26 }} />
              )
            ) : (
              // ✅✅✅ image-text-arrow 는 무조건 arrow 표시
              <IonIcon name="chevron-forward" size={24} color={theme.colors.gray4} />
            )}
          </View>
        </View>
      )}
    </Select.Item>
  );
};

export default memo(ERTabItemBase);

const styles = StyleSheet.create({
  /* -------------------------------------------------------------------------- */
  /*                                   CHIP                                     */
  /* -------------------------------------------------------------------------- */
  chipContainer: {
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
  },

  /* -------------------------------------------------------------------------- */
  /*                                   COLOR                                    */
  /* -------------------------------------------------------------------------- */
  colorDot: {
    width: 25,
    height: 25,
    borderRadius: 999,
  },

  /* -------------------------------------------------------------------------- */
  /*                                   ICON                                     */
  /* -------------------------------------------------------------------------- */
  iconColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },

  /* -------------------------------------------------------------------------- */
  /*                                   LINE                                     */
  /* -------------------------------------------------------------------------- */
  lineArea: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  lineText: {
    fontSize: 14,
  },

  /* -------------------------------------------------------------------------- */
  /*                               IMAGE-TEXT                                   */
  /* -------------------------------------------------------------------------- */
  imageTextRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  imageBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: '700',
  },

  imageTextRight: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
