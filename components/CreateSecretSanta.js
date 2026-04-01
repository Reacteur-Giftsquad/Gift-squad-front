import { Text, View } from "react-native";
import styles from "../styles/globals";
import Title from "./Title";

export default function CreateSecretSanta() {
  return (
    <View style={styles.content}>
      {/* <View style={styles.gap}></View> */}
      <Title heading="h2" text="informations" />
    </View>
  );
}
