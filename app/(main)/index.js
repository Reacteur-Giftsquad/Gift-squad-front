import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import styles from "../../styles/globals";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/EventCard";
import SubmitButton from "../../components/SubmitButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors/colors.json";
import ScreenWithMenu from "../../components/ScreenWithMenu";

export default function Events() {
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
        setIsLoading(false);
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
    };

    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator color={colors.green} />
  ) : (
    <ScreenWithMenu title="Invitations">
      <View style={styles.content}>
        <FlatList
          data={data}
          keyExtractor={(event) => String(event._id)}
          renderItem={({ event }) => <EventCard event={event} />}
        />
        <SubmitButton
          text="Ajouter un évenement"
          icon={<MaterialIcons name="add" size={24} color="white" />}
          onPress={() => router.navigate("/createEvent")}
        />
      </View>
    </ScreenWithMenu>
  );
}
