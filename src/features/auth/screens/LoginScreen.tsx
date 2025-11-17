import React from 'react';
import { Text } from 'react-native';
import { VStack } from '@/shared/layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoSvg from '@/assets/images/main-logo.svg';
import BaseButton from '../../../components/BasicButton/BaseButton';


// ✅ App.tsx의 RootStackParamList 타입을 다시 정의
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Detail: { message: string };
};

// ✅ Props 타입 지정 (navigation 객체를 안전하게 사용하기 위해)
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const onGoDetail = () => {
    navigation.replace('Detail', { message: '로그인 화면에서 이동함' });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <VStack gap={16} padding={{ x: 24 }} flex={1}>
          <VStack gap={16} justify='end' align='center' flex={1}>
              <LogoSvg />;
              <Text style={{ fontSize: 14, color: '#000', textAlign: 'center' }}>
                간단하고 편리한 운동을 위한{'\n'}당신의 헬스 메이트
              </Text>
          </VStack>
          <VStack gap={12} padding={{ x: 16 }} flex={1} justify='end'>
            {/* ✅ 클릭 시 Detail로 이동 */}
            <BaseButton onPress={onGoDetail}>Google로 시작하기</BaseButton>
            <BaseButton onPress={onGoDetail}>Apple로 시작하기</BaseButton>
            <BaseButton onPress={onGoDetail}>카카오로 시작하기</BaseButton>
            <BaseButton onPress={onGoDetail}>네이버로 시작하기</BaseButton>
          </VStack>
        </VStack>
    </SafeAreaView>
   
  );
};