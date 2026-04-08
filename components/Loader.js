import { View, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../assets/colors/colors.json";

export default function Loader() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
