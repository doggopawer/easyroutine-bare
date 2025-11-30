import React from 'react';
import styled from 'styled-components/native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

// 재사용 가능한 인풋 박스 컨테이너
const InputWrapper = styled.View`
  width: 100%;
  border-radius: 4px;
  border-width: 1px;
  border-color: #c7ccd1;
  padding: 0 12px;
  height: 40px;
  justify-content: center;
`;

// 실제 텍스트 입력 영역
const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const BaseInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  disabled,
}) => {
  return (
    <InputWrapper>
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        // disabled prop은 TextInput에 없음
        placeholderTextColor="#999"
      />
    </InputWrapper>
  );
};

export default BaseInput;
