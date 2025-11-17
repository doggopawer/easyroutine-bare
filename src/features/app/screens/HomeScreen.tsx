import BaseButton from "@/components/BasicButton/BaseButton";
import { AppStackParamList } from "@/navigation/types";
import { useTheme } from "@/theme/ThemeProvider/ThemeProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen: React.FC<NativeStackScreenProps<AppStackParamList, 'Home'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const onGoBack = () => navigation.goBack();

  return (
    <SafeAreaView
      style={[
        // styles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.colors.background },
      ]}
    >
      <View >
        <Text >상세 화면s</Text>
        {/* <Text >{}</Text> */}

        <BaseButton onPress={onGoBack} disabled={true}>뒤로가귀</BaseButton>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;