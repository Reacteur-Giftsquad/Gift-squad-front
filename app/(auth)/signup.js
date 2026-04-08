import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import showError from "../../utils/showError";
import styles from "../../styles/globals";
import api from "../../utils/api";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { StatusBar } from "expo-status-bar";
import SubmitButton from "../../components/SubmitButton";
import LinkButton from "../../components/LinkButton";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useBehavior } from "../../utils/useBehavior";

export default function SignupScreen() {
  const behaviour = useBehavior();

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
      router.replace("/(main)/dashboard");
    } catch (error) {
      showError(error, "Erreur lors de la creation du compte");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={behaviour}
      enabled={Platform.OS === "android"}
      style={styles.container}>
      <Header title="Signup" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Input
          title="Prenom"
          placeholder="Votre prenom"
          setState={(v) => setForm({ ...form, firstname: v })}
          value={form.firstname}
        />
        <Input
          title="Nom"
          placeholder="Votre nom"
          setState={(v) => setForm({ ...form, lastname: v })}
          value={form.lastname}
        />
        <Input
          title="Pseudo"
          placeholder="Votre pseudo"
          setState={(v) => setForm({ ...form, pseudo: v })}
          value={form.pseudo}
        />
        <Input
          title="Email"
          placeholder="Votre email"
          type="email"
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
          icon={<MaterialIcons name="person-add" size={24} color="white" />}
          text="Creer mon compte"
          onPress={handleSignup}
        />
        <LinkButton
          text={"Deja un compte ? Se connecter"}
          onPress={() => router.push("/")}
          icon={<MaterialIcons name="login" size={24} color={colors.green} />}
        />
      </ScrollView>
      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}
