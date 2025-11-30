import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteConfig } from '../../navigation/routeConfig';

interface LineTabProps {
    routes: RouteConfig[];

    activeTab?: string;
}

const LineTab: React.FC<LineTabProps> = ({ routes, activeTab }) => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {routes.map((route: RouteConfig) => {
                const isFocused = activeTab === route.name;

                const onPress = () => {
                    if (!isFocused) {
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
        paddingBottom: 10, // for safe area
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LineTab;