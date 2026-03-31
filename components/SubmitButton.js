import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors/colors.json";

const SubmitButton = ({ icon, text, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text>{icon}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
export default SubmitButton;
