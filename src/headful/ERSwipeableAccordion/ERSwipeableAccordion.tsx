import Accordion from '@/headless/Accordion/Accordion';
import Swipeable from '@/headless/Swipeable/Swipeable';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ArrowIcon from '@/assets/images/arrow.svg';
import { HStack } from '@/shared/layout';

type ERSwipeableAccordionProps = {
  visible: React.ReactNode;
  hidden: React.ReactNode;
  onTriggerPress?: () => void;
  onDeletePress?: () => void;
};

const ERSwipeableAccordion = ({
  visible,
  hidden,
  onTriggerPress,
  onDeletePress,
}: ERSwipeableAccordionProps) => {
  const { theme } = useTheme();

  return (
    <Swipeable maxSwipeDistance={80} borderRadius={12}>
      {/* ✅ 스와이프 히든 영역 */}
      <Swipeable.Hidden style={styles.swipeHidden}>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: theme.colors.red1 },
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={() => onDeletePress?.()}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.white1 }]}>삭제</Text>
        </Pressable>
      </Swipeable.Hidden>

      <Swipeable.Visible>
        <Accordion>
          <View style={[styles.cardWrapper, { backgroundColor: theme.colors.white1 }]}>
            <Accordion.Trigger style={styles.triggerRow} onPress={() => onTriggerPress?.()}>
              <HStack justify="space-between" width="100%" align="center">
                <View style={{ flex: 1, minWidth: 0 }}>{visible}</View>

                <View style={styles.arrowBox}>
                  <ArrowIcon width={18} height={18} />
                </View>
              </HStack>
            </Accordion.Trigger>

            <Accordion.Content style={styles.contentContainer}>
              <View style={styles.contentInner}>{hidden}</View>
            </Accordion.Content>
          </View>
        </Accordion>
      </Swipeable.Visible>
    </Swipeable>
  );
};

export default ERSwipeableAccordion;

const styles = StyleSheet.create({
  swipeHidden: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    width: 120,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    // ✅ 이게 핵심: 오른쪽 라운드 처리
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  deleteButtonPressed: {
    opacity: 0.85,
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  cardWrapper: {
    width: '100%',
  },

  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  arrowBox: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  contentContainer: {
    width: '100%',
  },

  contentInner: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});
