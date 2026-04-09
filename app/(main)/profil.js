// Profil: user profile screen with editable fields (name, pseudo, email).
// User can also log out from this screen.

import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import api from "../../utils/api";
import showError from "../../utils/showError";
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
import { useRouter } from "expo-router";
import { useBehavior } from "../../utils/useBehavior";

export default function Profil() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser, logout } = useAuth();
  const behaviour = useBehavior();

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    pseudo: user?.pseudo || "",
    email: user?.email || "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.put(`/user/modify/${user._id}`, {
        firstname: form.firstname,
        lastname: form.lastname,
        pseudo: form.pseudo,
        email: form.email,
      });

      await updateUser({ ...user, ...data });
      Alert.alert("Succes", "Profil mis a jour");
    } catch (error) {
      showError(error, "Erreur lors de la modification du compte");
    }
    setIsSubmitting(false);
  };

  return (
    <ScreenWithMenu title="Mon profil">
      <KeyboardAvoidingView
        behavior={behaviour}
        enabled={Platform.OS === "android"}
        style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
          <View style={styles.center}>
            <Octicons name="feed-person" size={100} color={colors.green} />
            <Title
              text={(user?.firstname || "") + " " + (user?.lastname || "")}
              heading="h1"
            />
            <LightText text={`@${user?.pseudo || ""}`} />
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
              setState={(v) => setForm({ ...form, pseudo: v })}
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
              text="Se déconnecter"
              onPress={async () => {
                await logout();
                router.replace("(auth)/");
              }}
              bgColor={colors.red}
              icon={<MaterialIcons name="logout" size={24} color="white" />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWithMenu>
  );
}
