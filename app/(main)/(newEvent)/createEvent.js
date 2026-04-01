import { StyleSheet, Text, View } from "react-native";

export default function createEvent() {
  return (
    <View style={styles.container}>
      <Text>This is the createEvent component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
