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
  fontSize,
  flex,
}) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          paddign: fontSize === "sm" ? 10 : 12,
          backgroundColor: bgColor || colors.green,
          flex: flex && 1,
        },
      ]}
      onPress={onPress}
      disabled={isSubmitting}>
      {isSubmitting ? (
        <ActivityIndicator color={color || "white"} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Text>{icon}</Text>}
          {text && (
            <Text
              style={{
                color: color || "white",
                fontSize: fontSize === "sm" ? 16 : 18,
              }}>
              {text}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
export default SubmitButton;
