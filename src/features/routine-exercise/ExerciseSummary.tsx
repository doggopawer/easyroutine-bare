import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ExerciseSummaryProps = {
  imageSrc: string;
  title: string;
  countText: string;

  /**
   * ✅ 0 ~ 1 사이의 진행률
   * - 예: 0.3 (30%)
   * - 값이 없으면 프로그레스바 렌더 안함
   */
  progress?: number;
};

const ExerciseSummary: React.FC<ExerciseSummaryProps> = ({
  imageSrc,
  title,
  countText,
  progress,
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

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {title}
          </Text>

          <Text style={[styles.count, { color: theme.colors.text }]} numberOfLines={1}>
            {countText}
          </Text>

          {/* ✅ progressbar를 countText 바로 아래로 이동 */}
          {hasProgress && (
            <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
              <View style={[styles.progressBar, barStyle]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ExerciseSummary;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  topRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '700',
  },

  count: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  /* -------------------------------------------------------------------------- */
  /*                                 ProgressBar                                */
  /* -------------------------------------------------------------------------- */

  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8, // ✅ countText 바로 아래 간격
  },

  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
});
