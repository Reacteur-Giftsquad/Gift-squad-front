// ScreenWithMenu: layout wrapper that adds a top header bar and a sliding side menu.
// Used by most main screens (dashboard, events, invitations, profile).
// The menu slides in from the left with a fade overlay.

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import colors from "../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "../styles/dashboardStyles";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ScreenWithMenu({ title, children, rightIcon }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate menu slide-in / slide-out when toggled
  useEffect(() => {
    if (menuOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuOpen]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "Gift Squad"}</Text>
        {rightIcon || <View style={{ width: 28 }} />}
      </View>

      {children}

      {menuOpen && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)}>
            <Animated.View
              style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <Text style={styles.menuTitle}>Menu</Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    router.replace("/(main)/dashboard");
                  }}>
                  <MaterialIcons name="home" size={22} color={colors.gray} />
                  <Text style={styles.menuItemText}>Accueil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    router.replace("/(main)/events");
                  }}>
                  <MaterialIcons
                    name="calendar-month"
                    size={22}
                    color={colors.gray}
                  />
                  <Text style={styles.menuItemText}>Mes événements</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    router.replace("/(main)/(newEvent)/");
                  }}>
                  <Feather name="plus" size={22} color={colors.gray} />
                  <Text style={styles.menuItemText}>Créer un événement</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={async () => {
                    router.replace("/invitations");
                  }}>
                  <FontAwesome name="envelope" size={22} color={colors.gray} />
                  <Text style={styles.menuItemText}>Invitations</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={async () => {
                    router.replace("/profil");
                  }}>
                  <MaterialIcons name="person" size={22} color={colors.gray} />
                  <Text style={styles.menuItemText}>Mon profil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={async () => {
                    await logout();
                    router.replace("(auth)/");
                  }}>
                  <MaterialIcons name="logout" size={22} color={colors.red} />
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
