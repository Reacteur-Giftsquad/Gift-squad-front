import { useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SubmitButton from "../../components/SubmitButton";
import styles from "../../styles/giftListStyles";

export default function WishList() {
  const { eventId, ownerId, ownerName, isOwn } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMyList = isOwn === "true";

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/gift/event/${eventId}`);
      const filtered = (data || []).filter(
        (g) => g.owner === ownerId || g.owner?._id === ownerId,
      );
      setGifts(filtered);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger la liste");
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const headerTitle = isMyList
    ? "Ma liste de souhaits"
    : `Liste de ${ownerName}`;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  const renderGift = ({ item: gift }) => {
    const isReservedByMe =
      gift.assignedTo === user._id || gift.assignedTo?._id === user._id;
    const isReservedByOther = gift.isAssigned && !isReservedByMe;

    return (
      <TouchableOpacity
        activeOpacity={isMyList ? 0.7 : 1}
        onPress={() => {
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
        }}>
        <View style={cardStyles.card}>
          <View style={cardStyles.imageContainer}>
            {gift.image_url ? (
              <Image
                source={{ uri: gift.image_url }}
                style={cardStyles.image}
              />
            ) : (
              <View style={[cardStyles.image, cardStyles.placeholder]}>
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
                  style={[
                    cardStyles.reservedOverlay,
                    cardStyles.reservedByUser,
                  ]}></View>
                <Text style={cardStyles.reservedText}>
                  Vous vous occuppez de ce cadeau
                </Text>
              </>
            )}
            {!isMyList && isReservedByOther && (
              <>
                <View
                  style={[
                    cardStyles.reservedOverlay,
                    cardStyles.reservedByOthers,
                  ]}></View>
                <Text style={cardStyles.reservedText}>
                  Quelqu'un s'occupe de ce cadeau
                </Text>
              </>
            )}
            {!isMyList && !gift.isAssigned && (
              <TouchableOpacity
                style={[cardStyles.overlay, { backgroundColor: "transparent" }]}
                onPress={() => handleReserve(gift)}
              />
            )}
          </View>
          <View style={cardStyles.info}>
            <Text style={cardStyles.name}>{gift.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={gifts}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={{ padding: 15, gap: 15, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderGift}
        ListFooterComponent={
          isMyList ? (
            <SubmitButton
              text="Ajouter un souhait"
              icon={<MaterialIcons name="add" size={24} color="white" />}
              onPress={() =>
                router.push({
                  pathname: "/(main)/addWish",
                  params: { eventId, ownerId },
                })
              }
            />
          ) : null
        }
      />
    </View>
  );
}

import { StyleSheet } from "react-native";

const cardStyles = StyleSheet.create({
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(78,173,81,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  overlayText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
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
