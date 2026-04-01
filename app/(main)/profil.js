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
import ScreenWithMenu from "../../components/ScreenWithMenu";

export default function Profil() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    pseudo: user.pseudo,
    email: user.email,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/user/modify/${user._id}`, {
        firstname: form.firstname,
        lastname: form.lastname,
        pseudo: form.pseudo,
        email: form.email,
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
    <ScreenWithMenu title="Mon profil">
      <View style={styles.content}>
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
            value={form.firstname}
            setState={(v) => setForm({ ...form, firstname: v })}
          />
          <Input
            title="Nom"
            placeholder={"Votre nom"}
            value={form.lastname}
            setState={(v) => setForm({ ...form, lastname: v })}
          />
          <Input
            title="Pseudo"
            placeholder="Choisissez un pseudo unique"
            value={form.pseudo}
            onChangeText={(v) => setForm({ ...form, pseudo: v })}
          />
          <Input
            title="Email"
            placeholder="Votre email"
            setState={(v) => setForm({ ...form, email: v })}
            value={form.email}
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
            bgColor={colors.red}
            icon={<MaterialIcons name="logout" size={24} color="white" />}
          />
        </View>
      </View>
    </ScreenWithMenu>
  );
}
