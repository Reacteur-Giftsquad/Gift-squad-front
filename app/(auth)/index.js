import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../styles/loginStyles";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import Input from "../../components/Input";
import api from "../../utils/api";
import SubmitButton from "../../components/SubmitButton";
import LinkButton from "../../components/LinkButton";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/user/login", {
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
        <SubmitButton
          icon={<MaterialIcons name="login" size={24} color="white" />}
          text="Se connecter"
          onPress={handleLogin}
        />
        <LinkButton
          text={"Pas encore de compte ? Créez-en un !"}
          onPress={() => router.push("/signup")}
          icon={
            <MaterialIcons
              name="person-add-alt-1"
              size={24}
              color={colors.green}
            />
          }
        />
      </View>
      <StatusBar style="light" />
    </View>
  );
}
