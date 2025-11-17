import React from 'react';
import styled from 'styled-components/native';

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const ButtonWrapper = styled.Pressable<{ disabled?: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 16px;
  font-weight: 600;
`;

const BaseButton: React.FC<Props> = ({ onPress, disabled, children }) => {
  return (
    <ButtonWrapper
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
    >
      {typeof children === 'string' ? <ButtonLabel>{children}</ButtonLabel> : children}
    </ButtonWrapper>
  );
};

export default BaseButton;