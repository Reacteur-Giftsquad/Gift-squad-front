import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";

export default function WishCard({ gift, isMyList }) {
  const router = useRouter();
  const { user } = useAuth();
  const isReservedByMe =
    gift.assignedTo === user._id || gift.assignedTo?._id === user._id;
  const isReservedByOther = gift.isAssigned && !isReservedByMe;

  const handlePress = () => {
    if (isMyList) {
      router.push({
        pathname: "/(main)/editWish",
        params: {
          giftId: gift._id,
          giftName: gift.name,
          giftPrice: String(gift.price || ""),
          giftLink: gift.link || "",
          giftImage: gift.image_url || "",
          giftDescription: gift.description || "",
        },
      });
    } else {
      router.push({
        pathname: "/(main)/giftDetails",
        params: {
          giftId: gift._id,
          giftName: gift.name,
          giftLink: gift.link || "",
          giftImage: gift.image_url || "",
          giftDescription: gift.descritption || "",
          assignedTo: gift.assignedTo,
          isAssigned: gift.isAssigned,
        },
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={isMyList ? 0.7 : 1} onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {gift.image_url ? (
            <Image source={{ uri: gift.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <MaterialIcons
                name="card-giftcard"
                size={40}
                color={colors.gray}
              />
            </View>
          )}
          {!isMyList && isReservedByMe && (
            <>
              <View
                style={[styles.reservedOverlay, styles.reservedByUser]}
              />
              <Text style={styles.reservedText}>
                Vous vous occuppez de ce cadeau
              </Text>
            </>
          )}
          {!isMyList && isReservedByOther && (
            <>
              <View
                style={[styles.reservedOverlay, styles.reservedByOthers]}
              />
              <Text style={styles.reservedText}>
                Quelqu'un s'occupe de ce cadeau
              </Text>
            </>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{gift.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  reservedOverlay: {
    width: "100%",
    height: "100%",
    opacity: 0.7,
    position: "absolute",
  },
  reservedText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    paddingBlock: 10,
  },
  reservedByOthers: {
    backgroundColor: "black",
  },
  reservedByUser: {
    backgroundColor: colors.green,
  },
});
