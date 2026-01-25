import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

export type ERImageTitleSubtitleVariant = 'sm' | 'lg';

type ERImageTitleSubtitleProps = {
  imageSrc: string;
  title: string;
  subtitle: string;

  /**
   * ✅ 스타일만 바꾸는 variant
   * - sm: RoutineExerciseItem 스타일
   * - lg: ExerciseSummary 스타일
   */
  variant?: ERImageTitleSubtitleVariant;

  /**
   * ✅ progress (0~1). 없으면 렌더 안함
   */
  progress?: number;

  /**
   * ✅ 이미지 박스 배경색 (없으면 기본값)
   */
  imageBackgroundColor?: string;
};

const ERImageTitleSubtitle: React.FC<ERImageTitleSubtitleProps> = ({
  imageSrc,
  title,
  subtitle,
  variant = 'sm',
  progress,
  imageBackgroundColor,
}) => {
  const { theme } = useTheme();

  const hasProgress = typeof progress === 'number';

  const safeProgress = useMemo(() => {
    if (!hasProgress) return 0;
    if (Number.isNaN(progress)) return 0;
    return Math.max(0, Math.min(1, progress));
  }, [hasProgress, progress]);

  const trackBg = theme.colors.gray5;
  const barBg = safeProgress === 1 ? theme.colors.primary1 : theme.colors.red1;

  const barStyle: ViewStyle = useMemo(
    () => ({
      width: `${safeProgress * 100}%`,
      backgroundColor: barBg,
    }),
    [safeProgress, barBg]
  );

  const isSm = variant === 'sm';

  const iconBoxStyle = useMemo(
    () => [
      styles.iconBox,
      isSm ? styles.iconBoxSm : styles.iconBoxLg,
      { backgroundColor: imageBackgroundColor ?? theme.colors.green2 },
    ],
    [imageBackgroundColor, isSm, theme.colors.green2]
  );

  const titleStyle = useMemo(
    () => [styles.title, isSm ? styles.titleSm : styles.titleLg, { color: theme.colors.text }],
    [isSm, theme.colors.text]
  );

  const subtitleStyle = useMemo(
    () => [
      styles.subtitle,
      isSm ? styles.subtitleSm : styles.subtitleLg,
      { color: isSm ? theme.colors.textMuted : theme.colors.text },
    ],
    [isSm, theme.colors.text, theme.colors.textMuted]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={iconBoxStyle}>
          <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.textBox}>
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>

          <Text style={subtitleStyle} numberOfLines={1}>
            {subtitle}
          </Text>

          {variant === 'lg' && hasProgress && (
            <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
              <View style={[styles.progressBar, barStyle]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ERImageTitleSubtitle;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    alignItems: 'center',
  },

  iconBox: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBoxSm: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },

  iconBoxLg: {
    width: 54,
    height: 54,
    borderRadius: 14,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  textBox: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },

  title: {
    fontWeight: '700',
  },

  titleSm: {
    fontSize: 13,
  },

  titleLg: {
    fontSize: 16,
  },

  subtitle: {
    fontWeight: '600',
  },

  subtitleSm: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },

  subtitleLg: {
    marginTop: 4,
    fontSize: 14,
  },

  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },

  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
});
