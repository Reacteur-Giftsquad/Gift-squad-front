import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../assets/colors/colors.json";

const LinkButton = ({ text, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon} <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 18,
    color: colors.green,
    textAlign: "center",
  },
});
export default LinkButton;
