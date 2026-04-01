import { StyleSheet, Text, View } from "react-native";
import ScreenWithMenu from "../../../components/ScreenWithMenu";

export default function createEvent() {
  return (
    <ScreenWithMenu title="Créer un événement">
      <View style={styles.container}>
        <Text>This is the createEvent component</Text>
      </View>
    </ScreenWithMenu>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
