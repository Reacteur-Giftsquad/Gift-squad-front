import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import api from "../../utils/api";
import Octicons from "@expo/vector-icons/Octicons";
import colors from "../../assets/colors/colors.json";
import { useAuth } from "../../context/AuthContext";
import Title from "../../components/Title";
import styles from "../../styles/globals";
import LightText from "../../components/LightText";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Profil() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(true);
  const { userId, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = api.get(`/user/${userId}`);
        setUser(data);
        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          Alert.alert(
            "Erreur",
            error.response.data.message ||
              "Erreur lors de la récuperation de données",
          );
        } else {
          Alert.alert("Erreur", "Impossible de se connecter au serveur");
        }
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/user/modify/${userId}`, {
        firstname: user.firstname,
        lastname: user.lastname,
        pseudo: user.pseudo,
        email: user.email,
      });

      setUser(data);
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Erreur",
          error.response.data.message ||
            "Erreur lors de la modification du compte",
        );
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <View style={styles.content}>
      {isLoading ? (
        <ActivityIndicator color={colors.green} />
      ) : (
        <>
          <View style={styles.center}>
            <Octicons name="feed-person" size={100} color={colors.green} />
            <Title text={user.firstname + " " + user.lastname} heading="h1" />
            <LightText text={`@${user.pseudo}`} />
          </View>
          <View style={styles.gap}>
            <Title text="INFORMATION PERSONNELLES" heading="h2" />
            <Input
              title="Prénom"
              placeholder={"Votre prénom"}
              value={user.firstname}
              setState={(v) => setUser({ ...user, firstname: v })}
            />
            <Input
              title="Nom"
              placeholder={"Votre nom"}
              value={user.lastname}
              setState={(v) => setUser({ ...user, lastname: v })}
            />
            <Input
              title="Pseudo"
              placeholder="Choisissez un pseudo unique"
              value={user.pseudo}
              onChangeText={(v) => setUser({ ...user, pseudo: v })}
            />
            <Input
              title="Email"
              placeholder="Votre email"
              setState={(v) => setUser({ ...user, email: v })}
              value={user.email}
            />
          </View>
          <View style={styles.gap}>
            <SubmitButton
              text="Enregistrer les modifications"
              onPress={handleSubmit}
              isSubmitting={isSubmitting}
              icon={<Ionicons name="save" size={24} color="white" />}
            />
            <SubmitButton
              text="Se déconnecterr"
              onPress={logout}
              red
              icon={<MaterialIcons name="logout" size={24} color="white" />}
            />
          </View>
        </>
      )}
    </View>
  );
}
