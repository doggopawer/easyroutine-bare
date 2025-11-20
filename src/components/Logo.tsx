import React from 'react';
import LogoSvg from '@/assets/images/main-logo.svg';

type Props = {
  size?: number;
};

// 로고 이미지 스타일


const Logo: React.FC<Props> = ({  }) => {
  return (
    <LogoSvg width={172} height={30} />
  );
};

export default Logo;