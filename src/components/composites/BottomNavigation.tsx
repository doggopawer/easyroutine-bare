import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type MainTabName = 'Home' | 'History' | 'Library' | 'MyPage';

interface BottomNavigationProps {
  activeTab?: MainTabName;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  const go = (name: MainTabName) => {
    if (activeTab === name) return;
    navigation.navigate(name);
  };

  const renderTab = (name: MainTabName, label: string, iconName: string) => {
    const isActive = activeTab === name;
    const color = isActive ? theme.colors.primary1 : theme.colors.gray3;

    return (
      <TouchableOpacity
        style={styles.tabButton}
        accessibilityRole="button"
        accessibilityState={isActive ? { selected: true } : {}}
        onPress={() => go(name)}
        activeOpacity={0.7}
      >
        <Ionicons name={iconName} size={22} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {renderTab('Home', '홈', 'home-outline')}
        {renderTab('History', '기록', 'calendar-outline')}
        {renderTab('Library', '라이브러리', 'bookmark-outline')}
        {renderTab('MyPage', '마이', 'person-outline')}
      </View>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  wrapper: {
    /* 탭바 위에 살짝 떠 보이게 (radius가 티나게) */
    backgroundColor: 'transparent',

    /* ✅ shadow는 Wrapper에 주는 게 정석 (Container는 overflow hidden 때문에 shadow가 잘림) */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  container: {
    flexDirection: 'row',
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    borderTopWidth: 0.5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
  },
});
