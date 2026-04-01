import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../assets/colors/colors.json";

const SubmitButton = ({
  icon,
  text,
  onPress,
  bgColor,
  color,
  isSubmitting,
}) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: bgColor || colors.green }]}
      onPress={onPress}
      disabled={isSubmitting}>
      {isSubmitting ? (
        <ActivityIndicator color={color || "white"} />
      ) : (
        <View style={styles.buttonContent}>
          <Text>{icon}</Text>
          <Text style={[styles.text, { color: color || "white" }]}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
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
  },
});
export default SubmitButton;
