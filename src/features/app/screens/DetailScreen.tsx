import BaseButton from '@/components/primitives/BaseButton';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Detail'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { message } = route.params;

  const onGoBack = () => navigation.goBack();

  return (
    <SafeAreaView
      style={[
        // styles.safe,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View>
        <Text>상세 화면</Text>
        <Text>{message}</Text>

        <BaseButton onPress={onGoBack}>뒤로가귀</BaseButton>
      </View>
    </SafeAreaView>
  );
};

export default DetailScreen;
