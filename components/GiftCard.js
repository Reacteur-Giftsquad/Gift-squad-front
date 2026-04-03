import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";
import styles from "../styles/giftListStyles";

export default function GiftCard({ gift }) {
  return (
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
              },
            })
          }>
          <MaterialIcons name="edit" size={22} color={colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Supprimer", `Supprimer "${gift.name}" ?`, [
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
            ])
          }>
          <MaterialIcons name="delete" size={22} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
