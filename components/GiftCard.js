import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";
import { useRouter } from "expo-router";
import OutlineButton from "./OutlineButton";
import api from "../utils/api";

export default function GiftCard({ gift, fetchData }) {
  const router = useRouter();

  const handleDeleteGift = () => {
    return Alert.alert("Supprimer", `Supprimer "${gift.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/gift/${gift._id}`);
            fetchData();
          } catch (error) {
            Alert.alert("Erreur", "Impossible de supprimer le cadeau");
          }
        },
      },
    ]);
  };
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(main)/editGift",
          params: {
            giftId: gift._id,
            giftName: gift.name,
            giftPrice: String(gift.price),
            giftLink: gift.link || "",
            giftImage: gift.image_url || "",
            mode: "gift",
          },
        })
      }>
      <View key={gift._id} style={styles.giftCard}>
        {gift.image_url ? (
          <Image source={{ uri: gift.image_url }} style={styles.giftImage} />
        ) : (
          <View style={[styles.giftImage, styles.giftImagePlaceholder]}>
            <MaterialIcons name="card-giftcard" size={40} color={colors.gray} />
          </View>
        )}

        <View style={styles.giftInfo}>
          <Text style={styles.giftName}>{gift.name}</Text>
          <Text style={styles.giftPrice}>{gift.price}€</Text>
        </View>

        {/* Icônes edit + delete */}
        <View style={styles.giftActions}>
          <OutlineButton onPress={handleDeleteGift} red>
            <MaterialIcons name="delete" size={30} color={colors.red} />
          </OutlineButton>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  giftCard: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  giftImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  giftImagePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  giftInfo: {
    alignSelf: "flex-start",
    flex: 1,
    paddingInline: 12,
    gap: 5,
  },
  giftName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  giftPrice: {
    fontSize: 16,
    color: colors.green,
    fontStyle: "italic",
  },
  giftActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
});
