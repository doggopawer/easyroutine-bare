import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';

const MyPageScreen: React.FC = () => {
    return (
        <PageLayout title="MyPage" showBack={false} activeTab="MyPage">
            <View style={styles.container}>
                <Text style={styles.text}>MyPage Screen</Text>
            </View>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20 },
});

export default MyPageScreen;
