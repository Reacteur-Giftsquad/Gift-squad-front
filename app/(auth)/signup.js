import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/signupStyles";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
      const { data } = await axios.post(`${API_URL}/user/signup`, {
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
      <Text style={styles.title}>Signup</Text>
      <TextInput
        placeholder="Prenom"
        onChangeText={(v) => setForm({ ...form, firstname: v })}
        value={form.firstname}
      />
      <TextInput
        placeholder="Nom"
        onChangeText={(v) => setForm({ ...form, lastname: v })}
        value={form.lastname}
      />
      <TextInput
        placeholder="Pseudo"
        onChangeText={(v) => setForm({ ...form, pseudo: v })}
        value={form.pseudo}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(v) => setForm({ ...form, email: v })}
        value={form.email}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, password: v })}
        value={form.password}
      />
      <TextInput
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
        value={form.confirmPassword}
      />
      <TouchableOpacity onPress={handleSignup}>
        <Text>Creer mon compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Deja un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
