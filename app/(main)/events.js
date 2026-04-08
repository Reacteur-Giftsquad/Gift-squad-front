import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import styles from "../../styles/globals";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import showError from "../../utils/showError";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import Loader from "../../components/Loader";
import EventCard from "../../components/EventCard";
import SubmitButton from "../../components/SubmitButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ScreenWithMenu from "../../components/ScreenWithMenu";

export default function Events() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/events", {
          params: { userId: user._id },
        });
        setData(response.data);
      } catch (error) {
        showError(error, "Les événements pas trouvés");
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setData((prev) => prev.filter((e) => e._id !== eventId));
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de supprimer l'événement",
      );
    }
  };

  return (
    <ScreenWithMenu
      title="Mes événements"
      rightIcon={
        <TouchableOpacity onPress={() => router.push("/(main)/invitations")}>
          <MaterialIcons name="mail" size={26} color="white" />
        </TouchableOpacity>
      }>
      <View style={styles.scrollContent}>
        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item._id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <EventCard event={item} onDelete={handleDelete} />
            )}
          />
        )}
        <SubmitButton
          text="Ajouter un événement"
          icon={<MaterialIcons name="add" size={24} color="white" />}
          onPress={() => router.push("/(main)/(newEvent)/")}
        />
      </View>
    </ScreenWithMenu>
  );
}
