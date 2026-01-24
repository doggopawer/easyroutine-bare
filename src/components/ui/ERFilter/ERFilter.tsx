import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import ERInput from '@/components/ui/ERInput/ERInput';
import ERTab from '@/components/ui/ERTab/ERTab';

interface FilterItem {
  label: string;
  value: string;
}

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;

  // Filter Props
  filterItems: FilterItem[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

const ERFilter: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = '검색',
  containerStyle,
  filterItems,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <View style={containerStyle}>
      <ERInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        containerStyle={styles.searchInputContainer}
        inputStyle={styles.fontWeight700}
      />

      <View style={styles.spacer16} />

      <ERTab
        variant="chip"
        defaultValue={filterItems[0]?.value}
        value={selectedFilter}
        onChange={onFilterChange}
      >
        {filterItems.map(item => (
          <ERTab.Item key={item.value} value={item.value}>
            {item.label}
          </ERTab.Item>
        ))}
      </ERTab>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    borderRadius: 999,
  },
  fontWeight700: {
    fontWeight: '700',
  },
  spacer16: {
    height: 16,
  },
});

export default ERFilter;
