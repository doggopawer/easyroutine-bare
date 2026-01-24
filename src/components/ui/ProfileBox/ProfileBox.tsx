import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ProfileBoxProps = {
  imageSrc?: string;
  name: string;
};

const FALLBACK_IMAGE = 'https://placehold.co/200x200/png';

const ProfileBox: React.FC<ProfileBoxProps> = ({ imageSrc, name }) => {
  const { theme } = useTheme();
  const [uri, setUri] = useState<string>(imageSrc ?? FALLBACK_IMAGE);

  useEffect(() => {
    setUri(imageSrc ?? FALLBACK_IMAGE);
  }, [imageSrc]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri }}
        resizeMode="cover"
        onError={e => {
          console.log('ProfileImage load error:', e.nativeEvent);
          setUri(FALLBACK_IMAGE);
        }}
      />
      <Text style={[styles.nameText, { color: theme.colors.text }]}>{name}</Text>
    </View>
  );
};

export default ProfileBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#ddd',
  },
  nameText: {
    fontSize: 16,
  },
});
