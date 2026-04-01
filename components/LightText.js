import { StyleSheet, Text } from "react-native";
import colors from "../assets/colors/colors.json";

export default function LightText({ text }) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.lightgray,
    fontSize: 18,
  },
});
