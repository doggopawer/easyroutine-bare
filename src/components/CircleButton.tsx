// CircleButton.tsx
import React from 'react';
import styled from 'styled-components/native';

type CircleButtonProps = {
  children: React.ReactNode;
  width: number;
  height: number;
  onCircleButtonClick?: () => void;
};

type WrapperProps = {
  $width: number;
  $height: number;
};

const CircleButtonWrapper = styled.Pressable<WrapperProps>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  min-width: ${({ $width }) => $width}px;

  border-radius: ${({ $width, $height }) => Math.min($width, $height) / 2}px;

  background-color: ${({ theme }) => theme.colors.primary1};

  align-items: center;
  justify-content: center;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
`;

const Label = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const CircleButton: React.FC<CircleButtonProps> = ({
  children,
  width,
  height,
  onCircleButtonClick,
}) => {
  return (
    <CircleButtonWrapper
      accessibilityRole="button"
      onPress={onCircleButtonClick}
      $width={width}
      $height={height}
    >
      {typeof children === 'string' ? <Label>{children}</Label> : children}
    </CircleButtonWrapper>
  );
};

export default CircleButton;
