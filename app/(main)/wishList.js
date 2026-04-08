// WishList: displays a participant's wish list for a Christmas List event.
// If it's the current user's list (isOwn), they can add/edit wishes.
// If it's someone else's list, they can view and reserve wishes.

import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../../utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loader from "../../components/Loader";
import SubmitButton from "../../components/SubmitButton";
import WishCard from "../../components/WishCard";
import styles from "../../styles/giftListStyles";

export default function WishList() {
  const { eventId, ownerId, ownerName, isOwn } = useLocalSearchParams();
  const router = useRouter();
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMyList = isOwn === "true";

  // Fetch all gifts for the event, then filter to only this owner's wishes
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

  if (isLoading) return <Loader />;

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
        renderItem={({ item }) => (
          <WishCard gift={item} isMyList={isMyList} />
        )}
        ListFooterComponent={
          isMyList ? (
            <SubmitButton
              text="Ajouter un souhait"
              icon={<MaterialIcons name="add" size={24} color="white" />}
              onPress={() =>
                router.push({
                  pathname: "/(main)/addGift",
                  params: { eventId, ownerId, mode: "wish" },
                })
              }
            />
          ) : null
        }
      />
    </View>
  );
}
