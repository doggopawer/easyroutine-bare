import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mainTabRoutes } from '../../navigation/routeConfig';

interface BottomNavigationProps {
    activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {mainTabRoutes.map((route) => {
                const isFocused = activeTab === route.name;

                const onPress = () => {
                    console.log('BottomNavigation onPress:', route.name, 'isFocused:', isFocused);
                    if (!isFocused) {
                        console.log('Navigating to:', route.name);
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        style={styles.tabButton}
                    >
                        <Text style={{ color: isFocused ? '#007AFF' : '#222' }}>
                            {route.title || route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        // paddingBottom: 10, // Removed as PageLayout handles safe area
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BottomNavigation;
