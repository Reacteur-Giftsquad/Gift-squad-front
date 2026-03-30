import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

const API_URL = "https://site--gift-squad-back--r62dpvlsxwvq.code.run";

export default function SignupScreen() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
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
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        return Alert.alert("Erreur", data.message || "Erreur lors de la creation du compte");
      }

      await login(data.token, data.user);
      router.push("/home");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
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
        onChangeText={(v) => setForm({ ...form, username: v })}
        value={form.username}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
