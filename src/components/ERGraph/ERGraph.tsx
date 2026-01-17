import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
  Line,
  ClipPath,
  Rect,
  Circle,
} from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type ERGraphPoint = {
  xLabel: string;
  value: number;
};

type ERGraphProps = {
  data: ERGraphPoint[];
  containerStyle?: ViewStyle;

  height?: number;
  labelHeight?: number;

  highlightIndex?: number | null;
  onHighlightChange?: (index: number) => void;

  showVerticalGrid?: boolean;

  lineColor?: string;
  fillColor?: string;
  gridColor?: string;

  showTooltip?: boolean;
};

type Point = { x: number; y: number };

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const clampW = (n: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(max, n));
};

const getMinMax = (values: number[]) => {
  if (values.length === 0) {
    return { min: 0, max: 1 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return { min, max: max + 1 };
  }
  return { min, max };
};

const buildSmoothPath = (points: Point[]) => {
  if (points.length === 0) {
    return '';
  }
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const d: string[] = [];
  d.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(' ');
};

const buildAreaPath = (linePath: string, points: Point[], bottomY: number) => {
  if (!linePath || points.length === 0) {
    return '';
  }
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
};

const ARect = Animated.createAnimatedComponent(Rect);
const ACircle = Animated.createAnimatedComponent(Circle);

const ERGraphBase: React.FC<ERGraphProps> = ({
  data,
  containerStyle,

  height = 190,
  labelHeight = 34,

  highlightIndex = null,
  onHighlightChange,

  showVerticalGrid = true,

  lineColor = '#86A7FF',
  fillColor = '#86A7FF',
  gridColor = '#E9EDF3',

  showTooltip = true,
}) => {
  const [w, setW] = useState(0);

  const padL = 16;
  const padR = 16;
  const padT = 14;
  const padB = 18;

  const chartH = height;
  const totalH = chartH + labelHeight;

  const isControlled = highlightIndex !== null && highlightIndex !== undefined;
  const [localIndex, setLocalIndex] = useState(0);

  const values = useMemo(() => data.map(d => d.value), [data]);
  const { min, max } = useMemo(() => getMinMax(values), [values]);

  const usableW = useMemo(() => Math.max(0, w - padL - padR), [w]);
  const usableH = useMemo(() => Math.max(1, chartH - padT - padB), [chartH]);

  const points = useMemo<Point[]>(() => {
    if (w <= 0 || data.length === 0) {
      return [];
    }
    const n = data.length;

    return data.map((d, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const x = padL + usableW * t;

      const norm = (d.value - min) / (max - min);
      const y = padT + usableH * (1 - norm);

      return { x, y };
    });
  }, [w, data, padL, usableW, min, max, padT, usableH]);

  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = useMemo(
    () => buildAreaPath(linePath, points, chartH - padB),
    [linePath, points, chartH, padB]
  );

  /* -------------------------------------------------------------------------- */
  /* ✅ “진짜 데이터 변경” 감지용 시그니처                                        */
  /* -------------------------------------------------------------------------- */

  const dataSignature = useMemo(() => {
    // 값/라벨이 같으면 같은 시그니처 → 하이라이트 클릭으로 리렌더되어도 애니메이션 안 함
    return data.map(d => `${d.xLabel}:${d.value}`).join('|');
  }, [data]);

  /* -------------------------------------------------------------------------- */
  /* ✅ UI Thread 공유값들                                                        */
  /* -------------------------------------------------------------------------- */

  const wSV = useSharedValue(0);
  const xArrSV = useSharedValue<number[]>([]);
  const yArrSV = useSharedValue<number[]>([]);
  const activeIndexSV = useSharedValue(0);

  const reveal = useSharedValue(0);

  // ✅ 여기 핵심: [data]가 아니라 [dataSignature]로만 트리거
  useEffect(() => {
    reveal.value = 0;
    reveal.value = withTiming(1, { duration: 700 });
  }, [dataSignature, reveal]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const nextW = e.nativeEvent.layout.width;
      setW(prev => (prev === nextW ? prev : nextW));
      wSV.value = nextW;
    },
    [wSV]
  );

  useEffect(() => {
    xArrSV.value = points.map(p => p.x);
    yArrSV.value = points.map(p => p.y);
  }, [points, xArrSV, yArrSV]);

  const setIndexJS = useCallback(
    (idx: number) => {
      if (isControlled) {
        onHighlightChange?.(idx);
        return;
      }
      setLocalIndex(idx);
      onHighlightChange?.(idx);
    },
    [isControlled, onHighlightChange]
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }
    const n = data.length;
    if (n <= 0) {
      return;
    }
    const next = clamp(highlightIndex ?? 0, 0, n - 1);
    activeIndexSV.value = withTiming(next, { duration: 160 });
  }, [isControlled, highlightIndex, data.length, activeIndexSV]);

  useEffect(() => {
    if (isControlled) {
      return;
    }
    const n = data.length;
    if (n <= 0) {
      return;
    }
    const next = clamp(localIndex, 0, n - 1);
    activeIndexSV.value = withTiming(next, { duration: 160 });
  }, [isControlled, localIndex, data.length, activeIndexSV]);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin(e => {
        const xs = xArrSV.value;
        const n = xs.length;
        if (n <= 0) {
          return;
        }

        let best = 0;
        let bestDist = Math.abs(xs[0] - e.x);

        for (let i = 1; i < n; i += 1) {
          const dist = Math.abs(xs[i] - e.x);
          if (dist < bestDist) {
            best = i;
            bestDist = dist;
          }
        }

        activeIndexSV.value = withTiming(best, { duration: 90 });
        runOnJS(setIndexJS)(best);
      })
      .onUpdate(e => {
        const xs = xArrSV.value;
        const n = xs.length;
        if (n <= 0) {
          return;
        }

        let best = 0;
        let bestDist = Math.abs(xs[0] - e.x);

        for (let i = 1; i < n; i += 1) {
          const dist = Math.abs(xs[i] - e.x);
          if (dist < bestDist) {
            best = i;
            bestDist = dist;
          }
        }

        activeIndexSV.value = withTiming(best, { duration: 60 });
        runOnJS(setIndexJS)(best);
      });
  }, [xArrSV, activeIndexSV, setIndexJS]);

  const hiIndex = useDerivedValue(() => {
    const n = xArrSV.value.length;
    if (n <= 0) {
      return 0;
    }
    return clampW(Math.round(activeIndexSV.value), 0, n - 1);
  });

  const hiX = useDerivedValue(() => {
    const xs = xArrSV.value;
    const n = xs.length;
    if (n <= 0) {
      return 0;
    }
    return xs[hiIndex.value] ?? 0;
  });

  const hiY = useDerivedValue(() => {
    const ys = yArrSV.value;
    const n = ys.length;
    if (n <= 0) {
      return 0;
    }
    return ys[hiIndex.value] ?? 0;
  });

  const clipAnimatedProps = useAnimatedProps(() => {
    return {
      width: wSV.value * reveal.value,
    };
  });

  const outerCircleProps = useAnimatedProps(() => {
    return { cx: hiX.value, cy: hiY.value };
  });

  const innerRingProps = useAnimatedProps(() => {
    return { cx: hiX.value, cy: hiY.value };
  });

  const hasData = data.length > 0 && w > 0;

  const currentIndex = useMemo(() => {
    if (data.length <= 0) {
      return 0;
    }
    const base = isControlled ? highlightIndex ?? 0 : localIndex;
    return clamp(base, 0, data.length - 1);
  }, [data.length, isControlled, highlightIndex, localIndex]);

  const tooltip = useMemo(() => {
    if (!showTooltip || data.length === 0 || points.length === 0) {
      return null;
    }

    const p = points[currentIndex];
    const d = data[currentIndex];
    if (!p || !d) {
      return null;
    }

    const left = clamp(p.x - 46, 8, Math.max(8, w - 92));
    const top = clamp(p.y - 46, 6, chartH - 70);

    return (
      <View pointerEvents="none" style={[styles.tooltip, { left, top }]}>
        <Text style={styles.tooltipValue}>{d.value}</Text>
        <Text style={styles.tooltipLabel} numberOfLines={1}>
          {d.xLabel}
        </Text>
      </View>
    );
  }, [showTooltip, data, points, currentIndex, w, chartH]);

  return (
    <View style={[styles.card, containerStyle]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', height: totalH }}>
            {tooltip}

            <Svg width="100%" height={totalH}>
              <Defs>
                <LinearGradient id="erGraphFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={fillColor} stopOpacity={0.2} />
                  <Stop offset="100%" stopColor={fillColor} stopOpacity={0.05} />
                </LinearGradient>

                <ClipPath id="erGraphClip">
                  <ARect animatedProps={clipAnimatedProps} x={0} y={0} height={chartH} />
                </ClipPath>
              </Defs>

              {hasData && showVerticalGrid && points.length >= 2 ? (
                <G>
                  {points.map((p, i) => (
                    <Line
                      key={`grid-${i}`}
                      x1={p.x}
                      y1={padT}
                      x2={p.x}
                      y2={chartH - padB}
                      stroke={gridColor}
                      strokeWidth={2}
                      opacity={0.7}
                    />
                  ))}
                </G>
              ) : null}

              {hasData ? (
                <G clipPath="url(#erGraphClip)">
                  {areaPath ? <Path d={areaPath} fill="url(#erGraphFill)" /> : null}
                  {linePath ? (
                    <Path
                      d={linePath}
                      fill="none"
                      stroke={lineColor}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : null}
                </G>
              ) : null}

              {hasData ? (
                <G>
                  <ACircle animatedProps={outerCircleProps} r={12} fill="#FFFFFF" />
                  <ACircle
                    animatedProps={innerRingProps}
                    r={9}
                    fill="transparent"
                    stroke={lineColor}
                    strokeWidth={5}
                  />
                </G>
              ) : null}

              <G>
                <Rect x={0} y={chartH} width={w} height={labelHeight} fill="transparent" />
              </G>
            </Svg>

            <View style={[styles.labelsRow, { height: labelHeight }]}>
              {data.map((d, i) => (
                <View key={`lbl-${i}`} style={styles.labelCell}>
                  <Text style={styles.labelText} numberOfLines={1}>
                    {d.xLabel}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default memo(ERGraphBase);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 5,
    overflow: 'hidden',
  },

  labelsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  labelCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },

  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9AA3AE',
  },

  tooltip: {
    position: 'absolute',
    width: 92,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#111',
    zIndex: 10,
  },

  tooltipValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },

  tooltipLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#D6DAE2',
    textAlign: 'center',
  },
});
