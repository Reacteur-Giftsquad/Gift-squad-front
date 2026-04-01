import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable, Animated } from "react-native";
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
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [menuOpen]);

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
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)}>
            <Animated.View
              style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
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
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}

      <StatusBar style="light" />
    </View>
  );
}
