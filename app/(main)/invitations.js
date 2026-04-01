import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenWithMenu from "../../components/ScreenWithMenu";

export default function Invitations() {
  return (
    <ScreenWithMenu title="Invitations">
      <View style={styles.content}>
        <Text>Invitation</Text>
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
