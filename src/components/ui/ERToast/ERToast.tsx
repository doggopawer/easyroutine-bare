import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';
import type { ComponentType } from 'react';

const IonIcon = Ionicons as unknown as ComponentType<IconProps>;
import type { ToastConfigParams } from 'react-native-toast-message';

type Props = ToastConfigParams<any> & {
  type: 'success' | 'error' | 'info';
};

const ERToastBase: React.FC<Props> = ({ type, text1, text2 }) => {
  const { theme } = useTheme();

  const getIconName = () => {
    if (type === 'success') return 'checkmark-circle';
    if (type === 'error') return 'close-circle';
    return 'information-circle';
  };

  const getBgColor = () => {
    if (type === 'success') return theme.colors.primary1;
    if (type === 'error') return theme.colors.red1;
    return theme.colors.gray1;
  };

  return (
    <View style={[styles.toastContainer, { backgroundColor: theme.colors.white1 }]}>
      {/* ✅ Left icon */}
      <View style={[styles.iconBox, { backgroundColor: getBgColor() }]}>
        <IonIcon name={getIconName()} size={20} color={theme.colors.white1} />
      </View>

      {/* ✅ Text */}
      <View style={styles.textBox}>
        {text1 ? (
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {text1}
          </Text>
        ) : null}

        {text2 ? (
          <Text style={[styles.desc, { color: theme.colors.textMuted }]} numberOfLines={2}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default memo(ERToastBase);

const styles = StyleSheet.create({
  toastContainer: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,

    // ✅ floating shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textBox: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
  },

  desc: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
