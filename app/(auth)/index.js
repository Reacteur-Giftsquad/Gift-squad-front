import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/loginStyles";
import axios from "axios";

const API_URL = "https://site--gift-squad-back--r62dpvlsxwvq.code.run";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      await login(data.token, data.user);
      router.push("/home");
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Erreur",
          error.response.data.message || "Email ou mot de passe incorrect",
        );
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}
