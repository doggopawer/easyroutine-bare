import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';

type MainTabName = 'Home' | 'History' | 'Library' | 'MyPage';

interface BottomNavigationProps {
  activeTab?: MainTabName;
}

type ActiveProps = {
  $active?: boolean;
};

const Wrapper = styled.View`
  /* 탭바 위에 살짝 떠 보이게 (radius가 티나게) */
  background-color: transparent;

  /* ✅ shadow는 Wrapper에 주는 게 정석 (Container는 overflow hidden 때문에 shadow가 잘림) */
  shadow-color: #000;
  shadow-offset: 0px -6px;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  elevation: 12;
`;

const Container = styled.View`
  flex-direction: row;
  height: 90px;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  overflow: hidden;

  border-top-width: 0.5px;
  border-top-color: ${({ theme }) => theme.colors.border};

  background-color: ${({ theme }) => theme.colors.background};
`;

const TabButton = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Label = styled(Text)<ActiveProps>`
  margin-top: 4px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary1 : theme.colors.gray3)};
`;

/** ✅ Ionicons도 styled로 감싸서 theme 기반 색 적용 가능 */
const TabIcon = styled(Ionicons)<ActiveProps>`
  color: ${({ theme, $active }) => ($active ? theme.colors.primary1 : theme.colors.gray3)};
`;

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const navigation = useNavigation<any>();
  const theme = useStyledTheme();

  const go = (name: MainTabName) => {
    if (activeTab === name) return;
    navigation.navigate(name);
  };

  return (
    <Wrapper>
      <Container>
        <TabButton
          accessibilityRole="button"
          accessibilityState={activeTab === 'Home' ? { selected: true } : {}}
          onPress={() => go('Home')}
          activeOpacity={0.7}
        >
          <TabIcon $active={activeTab === 'Home'} name="home-outline" size={22} />
          <Label $active={activeTab === 'Home'}>홈</Label>
        </TabButton>

        <TabButton
          accessibilityRole="button"
          accessibilityState={activeTab === 'History' ? { selected: true } : {}}
          onPress={() => go('History')}
          activeOpacity={0.7}
        >
          <TabIcon $active={activeTab === 'History'} name="calendar-outline" size={22} />
          <Label $active={activeTab === 'History'}>기록</Label>
        </TabButton>

        <TabButton
          accessibilityRole="button"
          accessibilityState={activeTab === 'Library' ? { selected: true } : {}}
          onPress={() => go('Library')}
          activeOpacity={0.7}
        >
          <TabIcon $active={activeTab === 'Library'} name="bookmark-outline" size={22} />
          <Label $active={activeTab === 'Library'}>라이브러리</Label>
        </TabButton>

        <TabButton
          accessibilityRole="button"
          accessibilityState={activeTab === 'MyPage' ? { selected: true } : {}}
          onPress={() => go('MyPage')}
          activeOpacity={0.7}
        >
          <TabIcon $active={activeTab === 'MyPage'} name="person-outline" size={22} />
          <Label $active={activeTab === 'MyPage'}>마이</Label>
        </TabButton>
      </Container>
    </Wrapper>
  );
};

export default BottomNavigation;
