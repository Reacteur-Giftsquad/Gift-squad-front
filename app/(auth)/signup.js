import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/globals";
import api from "../../utils/api";
import Header from "../../components/Header";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LinkButton from "../../components/LinkButton";

export default function SignupScreen() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      return Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
    }

    try {
      const { data } = await api.post("/user/signup", {
        firstname: form.firstname,
        lastname: form.lastname,
        pseudo: form.pseudo,
        email: form.email,
        password: form.password,
      });
      await login(data.token, data.user);
      router.push("/home");
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Erreur",
          error.response.data.message || "Erreur lors de la creation du compte",
        );
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Créer un compte" />
      <View style={styles.content}>
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
        <Input
          title="Mot de passe"
          placeholder="Votre mot de passe"
          setState={(v) => setForm({ ...form, password: v })}
          value={form.password}
          type="password"
        />
        <Input
          title="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          setState={(v) => setForm({ ...form, confirmPassword: v })}
          value={form.confirmPassword}
          type="password"
        />

        <SubmitButton
          text="Créer mon compte"
          onPress={handleSignup}
          icon={
            <MaterialIcons name="person-add-alt-1" size={24} color="white" />
          }
        />
        <LinkButton
          text={"Déjà un compte ? Se connecter"}
          onPress={() => router.push("/")}
          icon={<MaterialIcons name="login" size={24} color={colors.green} />}
        />
      </View>
    </View>
  );
}
