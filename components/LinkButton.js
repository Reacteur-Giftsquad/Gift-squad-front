import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../assets/colors/colors.json";

const LinkButton = ({ text, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text>{icon}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
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
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    color: colors.green,
    textAlign: "center",
  },
});
export default LinkButton;
