import React from 'react';
import { Text } from 'react-native';
import BasicButton from '../../../components/BasicButton/BasicButton';
import { Center, Divider, HStack, Spacer, VStack, ZStack } from '@/shared/layout';

export const ExampleScreen: React.FC = () => {
  return (
    <Center style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <VStack gap={16} padding={{ x: 24 }} width="100%" style={{ maxWidth: 640 }}>
        <VStack gap={8} align="center">
          <Text style={{ fontSize: 24, fontWeight: '700' }}>LOGO</Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            간단하고 편리한 운동을 위한{'\n'}당신의 헬스 메이트
          </Text>
        </VStack>

        <VStack gap={12} padding={{ x: 16 }}>
          <BasicButton>Google로 시작하기</BasicButton>
          <BasicButton>Apple로 시작하기</BasicButton>
          <BasicButton>카카오로 시작하기</BasicButton>
          <BasicButton>네이버로 시작하기</BasicButton>
        </VStack>

        <Divider />

        <HStack gap={12} align="center" justify="space-between">
          <Text>왼쪽</Text>
          <Spacer />
          <Text>중앙</Text>
          <Spacer />
          <Text>오른쪽</Text>
        </HStack>

        <ZStack width="100%" height={100} style={{ backgroundColor: '#fff', borderRadius: 12 }}>
          <Center><Text>Base</Text></Center>
          <Center><Text style={{ fontWeight: '700' }}>Overlay</Text></Center>
        </ZStack>
      </VStack>
    </Center>
  );
};