import React from 'react';
import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';
import { HStack } from '@/shared/layout';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onPressXMark?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

// 재사용 가능한 인풋 박스 컨테이너
const InputWrapper = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 14px 18px;
  height: 44px;
  justify-content: center;
  background-color: gray;
`;

// 실제 텍스트 입력 영역
const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const SearchInput: React.FC<Props> = ({
  value,
  onChangeText,
  onPressXMark,
  placeholder,
  secureTextEntry,
  disabled,
}) => {
  return (
    <InputWrapper>
    <HStack gap={8} align='center'>
        <Feather name="home" size={14} color="#000" />
        <StyledInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            editable={!disabled}
            // disabled prop은 TextInput에 없음
            placeholderTextColor="#999"
        />
        <Feather name="home" size={14} color="#000" onPress={onPressXMark} />
    </HStack>
     
    </InputWrapper>
  );
};

export default SearchInput;