import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import styles from "../../styles/globals";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import EventCard from "../../components/EventCard";
import SubmitButton from "../../components/SubmitButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors/colors.json";
import ScreenWithMenu from "../../components/ScreenWithMenu";

export default function Events() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/events/${user._id}`);

        setData(response.data);
      } catch (error) {
        if (error.response) {
          Alert.alert(
            "Erreur",
            error.response.data.message || "Les événements pas trouvés",
          );
        } else {
          Alert.alert("Erreur", "Impossible de se connecter au serveur");
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <ScreenWithMenu title="Mes événements">
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.green} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item._id)}
            renderItem={({ item }) => <EventCard event={item} />}
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
