import { View } from "react-native";
import styles from "../../../styles/globals";
import Title from "../../../components/Title";
import SubmitButton from "../../../components/SubmitButton";
import { useRouter } from "expo-router";

export default function CreateEvent() {
  const router = useRouter();
  return (
    <View style={styles.content}>
      <Title text="Quel type d'événement souhaitez-vous créer ?" heading="h1" />
      <SubmitButton
        text="Secret Santa"
        onsPress={() => {
          router.push({
            pathname: "/createEvent",
            params: { type: "secretSanta" },
          });
        }}
      />
      <SubmitButton
        text="Anniversaire"
        onsPress={() => {
          router.push({
            pathname: "/createEvent",
            params: { type: "birthday" },
          });
        }}
      />
      <SubmitButton
        text="Liste de Noël"
        onsPress={() => {
          router.push({
            pathname: "/createEvent",
            params: { type: "christmasList" },
          });
        }}
      />
    </View>
  );
}
