import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

type ProfileBoxProps = {
  imageSrc?: string;
  name: string;
};

const FALLBACK_IMAGE = 'https://placehold.co/200x200/png';

const Container = styled.View`
  width: 100%;
  padding: 16px;
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 20px;
  background-color: #ddd;
`;

const NameText = styled.Text`
  font-size: 16px;
  color: #111;
`;

const ProfileBox: React.FC<ProfileBoxProps> = ({ imageSrc, name }) => {
  const [uri, setUri] = useState<string>(imageSrc ?? FALLBACK_IMAGE);

  useEffect(() => {
    setUri(imageSrc ?? FALLBACK_IMAGE);
  }, [imageSrc]);

  return (
    <Container>
      <ProfileImage
        source={{ uri }}
        resizeMode="cover"
        onError={e => {
          console.log('ProfileImage load error:', e.nativeEvent);
          setUri(FALLBACK_IMAGE);
        }}
      />
      <NameText>{name}</NameText>
    </Container>
  );
};

export default ProfileBox;
