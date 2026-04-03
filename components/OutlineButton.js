import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../assets/colors/colors.json";

export default function OutlineButton({ onPress, children, red }) {
  return (
    <TouchableOpacity
      style={[styles.outline, { borderColor: red ? colors.red : colors.green }]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
