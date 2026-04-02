import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SubmitButton from "../../components/SubmitButton";
import Title from "../../components/Title";
import styles from "../../styles/giftListStyles";

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
        const contribRes = await api.get(`/contributions`, {
          params: { eventId },
        });
        setContributions(contribRes.data || []);
      } catch {}
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de charger les cadeaux");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalGiftsPrice = gifts.reduce((sum, g) => sum + (g.price || 0), 0);
  const totalCollected = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);

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

      <ScrollView contentContainerStyle={styles.content}>
        <Title
          text={`Idées de cadeaux pour ${eventName || ""}`}
          heading="h1"
        />
        <Text style={styles.collectedText}>
          Montant total collecté : <Text style={{ fontWeight: "bold" }}>{totalCollected}€</Text> sur{" "}
          <Text style={{ fontWeight: "bold" }}>{totalGiftsPrice}€</Text>
        </Text>

        {gifts.map((gift) => (
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
          </View>
        ))}

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
      </ScrollView>
    </View>
  );
}
