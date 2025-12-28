import Accordion from '@/headless/Accordion/Accordion';
import Swipeable from '@/headless/Swipeable/Swipeable';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FireIcon from '@/assets/images/fire.svg';
import ArrowIcon from '@/assets/images/arrow.svg';

type RoutineCardProps = {
  title: string;
  countText: string; // 예: "5종목"
  onPress?: () => void;
};

const RoutineCard = ({ title, countText, onPress }: RoutineCardProps) => {
  const { theme } = useTheme();

  return (
    <Swipeable maxSwipeDistance={120}>
      {/* ✅ 스와이프 히든 영역 */}
      <Swipeable.Hidden style={styles.swipeHidden}>
        <Text style={styles.swipeHiddenText}>숨겨진 곳</Text>
      </Swipeable.Hidden>

      <Swipeable.Visible>
        <Accordion>
          {/* ✅ Trigger + Content를 감싸는 카드 wrapper (여기가 "한 장의 카드") */}
          <View style={[styles.cardWrapper, { backgroundColor: theme.colors.white1 }]}>
            {/* ✅ Trigger는 카드 내부의 상단 영역 */}
            <Accordion.Trigger
              style={styles.triggerRow}
              onPress={() => {
                onPress?.();
              }}
            >
              {/* ✅ 왼쪽 아이콘 박스 */}
              <View style={[styles.iconBox, { backgroundColor: theme.colors.green2 }]}>
                <FireIcon />
              </View>

              {/* ✅ 가운데 텍스트 영역 */}
              <View style={styles.textBox}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                <Text style={[styles.count, { color: theme.colors.text }]}>{countText}</Text>
              </View>

              {/* ✅ 오른쪽 화살표 */}
              <View style={styles.arrowBox}>
                <ArrowIcon />
              </View>
            </Accordion.Trigger>

            {/* ✅ Content는 같은 카드 wrapper 내부에서 아래로 확장 */}
            <Accordion.Content style={styles.contentContainer}>
              <View style={styles.contentInner}>
                <Text style={[styles.contentText, { color: theme.colors.textMuted }]}>
                  펼쳐진 곳
                </Text>
              </View>
            </Accordion.Content>
          </View>
        </Accordion>
      </Swipeable.Visible>
    </Swipeable>
  );
};

export default RoutineCard;

const styles = StyleSheet.create({
  /* -------------------------------------------------------------------------- */
  /*                                Swipe Hidden                                */
  /* -------------------------------------------------------------------------- */

  swipeHidden: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  swipeHiddenText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* -------------------------------------------------------------------------- */
  /*                               Card Wrapper (전체)                           */
  /* -------------------------------------------------------------------------- */

  cardWrapper: {
    width: '100%',
    borderRadius: 12,

    // ✅ Content가 내부에서 늘어날 때 깔끔하게 라운드 유지
    overflow: 'hidden',

    // ✅ 그림자 (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // ✅ 그림자 (Android)
    elevation: 3,
  },

  /* -------------------------------------------------------------------------- */
  /*                                 Trigger Row                                */
  /* -------------------------------------------------------------------------- */

  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 22,
  },

  textBox: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  count: {
    fontSize: 14,
    fontWeight: '600',
  },

  arrowBox: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 18,
  },

  /* -------------------------------------------------------------------------- */
  /*                                Accordion Content                            */
  /* -------------------------------------------------------------------------- */

  contentContainer: {
    width: '100%',
  },

  contentInner: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  contentText: {
    fontSize: 14,
  },
});
