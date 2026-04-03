import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../assets/colors/colors.json";

export default function FilledIcon({ onPress, children, red }) {
  return (
    <TouchableOpacity
      style={[
        styles.imageBtn,
        { backgroundColor: red ? colors.red : colors.green },
      ]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageBtn: {
    backgroundColor: colors.green,
    borderRadius: 10,
    padding: 15,
  },
});
