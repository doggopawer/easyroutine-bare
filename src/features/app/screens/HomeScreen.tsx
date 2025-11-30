import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/primitives/BaseButton";
import Logo from "@/components/Logo";
import SearchInput from "@/components/SearchInput";
import { AppStackParamList } from "@/navigation/types";
import { useTheme } from "@/theme/ThemeProvider/ThemeProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [value, setValue] = useState("");

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
        <Logo />
        <SearchInput onChangeText={(value) => { setValue(value) }} value={value} placeholder="Search" />
        <BaseInput onChangeText={(value) => { setValue(value) }} value={value} />
        <BaseButton onPress={onGoBack} disabled={true}>뒤로가귀</BaseButton>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;