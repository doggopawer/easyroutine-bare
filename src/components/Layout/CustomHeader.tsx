import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
    title?: string;
    showBack?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, showBack }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {showBack && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.rightPlaceholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 16,
        color: '#007AFF',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    rightPlaceholder: {
        width: 40, // Approximate width of back button to center title
    },
});

export default CustomHeader;
