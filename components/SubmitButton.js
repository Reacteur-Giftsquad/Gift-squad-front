import { Pressable, StyleSheet, Text } from "react-native";
import colors from "../assets/colors/colors.json";

const SubmitButton = ({ icon, text, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {icon}<Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    padding: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
export default SubmitButton;
