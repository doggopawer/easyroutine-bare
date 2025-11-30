import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from './CustomHeader';
import BottomNavigation from '../composites/BottomNavigation';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    showBack?: boolean;
    showHeader?: boolean;
    activeTab?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    showBack = false,
    showHeader = true,
    activeTab
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {showHeader && <CustomHeader title={title} showBack={showBack} />}
            <View style={styles.content}>
                {children}
            </View>
            {activeTab && <BottomNavigation activeTab={activeTab} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});

export default PageLayout;
