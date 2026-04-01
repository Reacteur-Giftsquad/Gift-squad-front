import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "../../styles/dashboardStyles";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gift Squad</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>
          Bienvenue {user?.pseudo || user?.firstname || ""}
        </Text>
        <Text style={styles.subtitle}>Ne t'en fais pas</Text>
        <Text style={styles.subtitle}>Secret Santa est la pour toi !</Text>
      </View>

      {menuOpen && (
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.menu} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                await logout();
                router.replace("/");
              }}
            >
              <MaterialIcons name="logout" size={22} color={colors.green} />
              <Text style={styles.menuItemText}>Se deconnecter</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}

      <StatusBar style="light" />
    </View>
  );
}
