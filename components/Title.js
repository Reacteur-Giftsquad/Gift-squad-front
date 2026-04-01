import { StyleSheet, Text } from "react-native";

export default function Title({ text, heading }) {
  const headingSize = {
    h1: 24,
    h2: 20,
  };
  const fontSize = headingSize[heading];
  return <Text style={[styles.title, { fontSize }]}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    lineHeight: 30,
  },
});
