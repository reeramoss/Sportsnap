import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface ChipSelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T | null;
  onSelect: (value: T) => void;
}

export function ChipSelector<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: ChipSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {options.map((option) => {
            const isSelected = option === selected;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onSelect(option)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipSelected: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
