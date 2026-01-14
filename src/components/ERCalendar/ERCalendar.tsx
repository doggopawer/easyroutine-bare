import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  createContext,
} from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { IconProps } from 'react-native-vector-icons/Icon';
import type { ComponentType } from 'react';

const MaterialIcon = MaterialIcons as unknown as ComponentType<IconProps>;

export type Dot = {
  key: string;
  color?: string;
};

export type ERCalendarSingleProps = {
  value?: string | null; // ✅ 선택된 날짜 (YYYY-MM-DD)
  onChange: (date: string) => void; // ✅ 날짜 선택
  dotsByDate?: Record<string, Dot[]>; // ✅ YYYY-MM-DD -> dots(최대 3개 표시)
  containerStyle?: ViewStyle;

  // ✅ 월이 바뀔 때 부모가 API 호출할 수 있게 (YYYY-MM)
  onMonthChange?: (yyyyMm: string) => void;
};

/* -------------------------------------------------------------------------- */
/*                               ✅ Utils                                     */
/* -------------------------------------------------------------------------- */

const getTodayString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const toMonthTitle = (yyyyMmDd: string) => {
  const [y, m] = yyyyMmDd.split('-').map(v => Number(v));
  const date = new Date(y, m - 1, 1);
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${month} ${y}`;
};

const toYYYYMM = (yyyyMmDd: string) => yyyyMmDd.slice(0, 7);

const addMonths = (yyyyMmDd: string, diff: number) => {
  const [y, m] = yyyyMmDd.split('-').map(v => Number(v));
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + diff);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}-01`;
};

/* -------------------------------------------------------------------------- */
/*                          ✅ Context (dayComponent용)                        */
/* -------------------------------------------------------------------------- */

type CalendarCtxValue = {
  onPressDateString: (dateString: string) => void;
};

const CalendarCtx = createContext<CalendarCtxValue | null>(null);

const useCalendarCtx = () => {
  const ctx = useContext(CalendarCtx);
  if (!ctx) {
    throw new Error('[ERCalendar] CalendarCtx not found');
  }
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*                             ✅ Day Cell                                    */
/* -------------------------------------------------------------------------- */

type DayCellProps = {
  dateString: string;
  dayNumber: number;
  state?: 'disabled' | 'today' | '';
  selected: boolean;
  dots?: { key: string; color: string }[];
};

const ERCalendarDayCellBase: React.FC<DayCellProps> = ({
  dateString,
  dayNumber,
  state,
  selected,
  dots,
}) => {
  const { onPressDateString } = useCalendarCtx();
  const isDisabled = state === 'disabled';

  return (
    <Pressable
      onPress={() => onPressDateString(dateString)}
      style={styles.dayCell}
      disabled={isDisabled}
      hitSlop={6}
    >
      <View
        style={[
          styles.dayCircle,
          selected && styles.dayCircleSelected,
          isDisabled && styles.dayCircleDisabled,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            selected && styles.dayTextSelected,
            isDisabled && styles.dayTextDisabled,
          ]}
        >
          {dayNumber}
        </Text>
      </View>

      <View style={styles.dotRow}>
        {(dots ?? []).slice(0, 3).map(d => (
          <View key={d.key} style={[styles.dot, { backgroundColor: d.color }]} />
        ))}
      </View>
    </Pressable>
  );
};

const ERCalendarDayCell = memo(ERCalendarDayCellBase);

/* -------------------------------------------------------------------------- */
/*                     ✅ Calendar dayComponent (렌더 밖 정의)                 */
/* -------------------------------------------------------------------------- */

type CalendarDayComponentProps = {
  date?: DateData;
  state?: 'disabled' | 'today' | '';
  marking?: {
    selected?: boolean;
    dots?: { key: string; color: string }[];
  };
};

const ERCalendarDayComponentBase: React.FC<CalendarDayComponentProps> = ({
  date,
  state,
  marking,
}) => {
  const dateString = date?.dateString ?? '';
  const dayNumber = date?.day ?? 0;

  if (!dateString || !dayNumber) {
    return <View style={styles.dayCell} />;
  }

  return (
    <ERCalendarDayCell
      dateString={dateString}
      dayNumber={dayNumber}
      state={state}
      selected={!!marking?.selected}
      dots={marking?.dots ?? []}
    />
  );
};

const ERCalendarDayComponent = memo(ERCalendarDayComponentBase);

/* -------------------------------------------------------------------------- */
/*                           ✅ Main Component                                 */
/* -------------------------------------------------------------------------- */

const ERCalendarSingleBase: React.FC<ERCalendarSingleProps> = ({
  value,
  onChange,
  dotsByDate = {},
  containerStyle,
  onMonthChange,
}) => {
  const today = useMemo(() => getTodayString(), []);
  const initialMonth = useMemo(() => (value ? value.slice(0, 7) + '-01' : today), [value, today]);

  const [visibleMonth, setVisibleMonth] = useState<string>(initialMonth);

  // ✅ 외부 value가 바뀌면 해당 월로 이동(월이 다를 때만)
  useEffect(() => {
    if (!value) {
      return;
    }
    const nextMonth = value.slice(0, 7) + '-01';
    if (toYYYYMM(nextMonth) !== toYYYYMM(visibleMonth)) {
      setVisibleMonth(nextMonth);
    }
  }, [value, visibleMonth]);

  // ✅ dots + selected
  const markedDates = useMemo(() => {
    const out: Record<
      string,
      {
        selected?: boolean;
        dots?: { key: string; color: string }[];
      }
    > = {};

    Object.entries(dotsByDate).forEach(([date, dots]) => {
      out[date] = {
        ...(out[date] ?? {}),
        dots: (dots ?? []).slice(0, 3).map(d => ({
          key: d.key,
          color: d.color ?? '#111',
        })),
      };
    });

    if (value) {
      out[value] = {
        ...(out[value] ?? {}),
        selected: true,
      };
    }

    return out;
  }, [dotsByDate, value]);

  const emitMonthChange = useCallback(
    (yyyyMmDd: string) => {
      if (!onMonthChange) {
        return;
      }
      onMonthChange(toYYYYMM(yyyyMmDd));
    },
    [onMonthChange]
  );

  const handlePrevMonth = useCallback(() => {
    setVisibleMonth(prev => {
      const next = addMonths(prev, -1);
      emitMonthChange(next);
      return next;
    });
  }, [emitMonthChange]);

  const handleNextMonth = useCallback(() => {
    setVisibleMonth(prev => {
      const next = addMonths(prev, 1);
      emitMonthChange(next);
      return next;
    });
  }, [emitMonthChange]);

  const handleCalendarMonthChange = useCallback(
    (m: DateData) => {
      const next = (m.dateString ?? '').slice(0, 7) + '-01';
      if (!next || next.length !== 10) {
        return;
      }

      setVisibleMonth(prev => {
        if (toYYYYMM(prev) === toYYYYMM(next)) {
          return prev;
        }
        return next;
      });

      emitMonthChange(next);
    },
    [emitMonthChange]
  );

  const handlePressDateString = useCallback(
    (dateString: string) => {
      onChange(dateString);
    },
    [onChange]
  );

  const ctxValue = useMemo<CalendarCtxValue>(
    () => ({
      onPressDateString: handlePressDateString,
    }),
    [handlePressDateString]
  );

  return (
    <CalendarCtx.Provider value={ctxValue}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{toMonthTitle(visibleMonth)}</Text>

          <View style={styles.headerActions}>
            <Pressable onPress={handlePrevMonth} style={styles.arrowBtn} hitSlop={8}>
              <MaterialIcon name="chevron-left" size={28} color="#111" />
            </Pressable>
            <Pressable onPress={handleNextMonth} style={styles.arrowBtn} hitSlop={8}>
              <MaterialIcon name="chevron-right" size={28} color="#111" />
            </Pressable>
          </View>
        </View>

        <Calendar
          key={toYYYYMM(visibleMonth)} // ✅✅✅ 핵심: 월 바뀌면 Calendar 리마운트 → 버튼 월 이동 100% 동작
          current={visibleMonth}
          renderHeader={() => null}
          hideArrows
          hideExtraDays={false}
          markingType="multi-dot"
          markedDates={markedDates}
          onMonthChange={handleCalendarMonthChange}
          onDayPress={(day: DateData) => onChange(day.dateString)}
          dayComponent={ERCalendarDayComponent}
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: '#111',
            textDayHeaderFontWeight: '600',
            textDayHeaderFontSize: 13,
            textDayFontSize: 14,
            dayTextColor: '#111',
            textDisabledColor: '#C9CED6',
            dotColor: '#111',
            selectedDotColor: '#FFFFFF',
          }}
          style={styles.calendar}
        />
      </View>
    </CalendarCtx.Provider>
  );
};

export default memo(ERCalendarSingleBase);

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  arrowBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendar: {
    backgroundColor: 'transparent',
  },

  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 46,
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayCircleSelected: {
    backgroundColor: '#6691FF',
  },

  dayCircleDisabled: {
    opacity: 0.5,
  },

  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },

  dayTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },

  dayTextDisabled: {
    color: '#C9CED6',
  },

  dotRow: {
    marginTop: 4,
    height: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
});
