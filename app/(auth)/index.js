import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/loginStyles";
import axios from "axios";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import Input from "../../components/Input";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import api from "../../utils/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await api.post(`${API_URL}/user/login`, {
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
      <Header title="Login" />
      <View style={styles.content}>
        <Input
          title="Email"
          placeholder="Votre email"
          setState={setEmail}
          value={email}
        />
        <Input
          title="Mot de passe"
          placeholder="Votre mot de passe"
          setState={setPassword}
          value={password}
          type="password"
        />
        <TouchableOpacity onPress={handleLogin}>
          <Text>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
