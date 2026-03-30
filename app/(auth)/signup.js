import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [form, setForm] = useState({
    firstname: "", lastname: "", username: "", email: "", password: ""
  });
  const router = useRouter();

  const handleSignup = async () => {
    console.log("signup pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput placeholder="Prénom" onChangeText={(v) => setForm({...form, firstname: v})} />
      <TextInput placeholder="Nom" onChangeText={(v) => setForm({...form, lastname: v})} />
      <TextInput placeholder="Pseudo" onChangeText={(v) => setForm({...form, username: v})} />
      <TextInput placeholder="Email" onChangeText={(v) => setForm({...form, email: v})} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={(v) => setForm({...form, password: v})} />
      <TouchableOpacity onPress={handleSignup}>
        <Text>Créer mon compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // vertical centering
    alignItems: "center",       // horizontal centering
    backgroundColor: "#fff",
    gap : 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  }
});