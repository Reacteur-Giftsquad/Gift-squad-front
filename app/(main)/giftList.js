import { useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SubmitButton from "../../components/SubmitButton";
import Title from "../../components/Title";
import styles from "../../styles/giftListStyles";
import GiftCard from "../../components/GiftCard";

export default function GiftList() {
  const { eventId, eventName } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [gifts, setGifts] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/gift/event/${eventId}`);
      setGifts(data || []);

      try {
        const contribRes = await api.get(`/contribution/event/${eventId}`);
        setContributions(contribRes.data || []);
      } catch {
        if (error.response) {
          Alert.alert("Erreur", error.response.data.message || "Erreur");
        } else {
          Alert.alert("Erreur", "Impossible de charger les contributions");
        }
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de charger les cadeaux");
      }
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const totalGiftsPrice = gifts.reduce((sum, g) => sum + (g.price || 0), 0);
  const totalCollected = contributions.reduce(
    (sum, c) => sum + (c.amount || 0),
    0,
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liste de cadeaux</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Title text={`Idées de cadeaux pour ${eventName || ""}`} heading="h1" />
        <Text style={styles.collectedText}>
          Montant total collecté :{" "}
          <Text style={{ fontWeight: "bold" }}>{totalCollected}€</Text> sur{" "}
          <Text style={{ fontWeight: "bold" }}>{totalGiftsPrice}€</Text>
        </Text>

        <FlatList
          data={gifts}
          keyExtractor={(item) => String(item._id)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <GiftCard gift={item} fetchData={fetchData} />
          )}
        />
        <SubmitButton
          text="Ajouter un cadeau"
          icon={<MaterialIcons name="add" size={24} color="white" />}
          onPress={() =>
            router.push({
              pathname: "/(main)/addGift",
              params: { eventId },
            })
          }
        />
      </View>
    </View>
  );
}
