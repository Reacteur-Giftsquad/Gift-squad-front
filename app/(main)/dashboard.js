// Dashboard: main home screen after login.
// Shows welcome message and activity cards (Secret Santa, Birthday, Christmas List).

import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAuth } from "../../context/AuthContext";
import ScreenWithMenu from "../../components/ScreenWithMenu";
import styles from "../../styles/dashboardStyles";
import colors from "../../assets/colors/colors.json";
import SubmitButton from "../../components/SubmitButton";

// Available event types shown on the dashboard
const ACTIVITIES = [
  {
    type: "secretSanta",
    label: "Secret Santa",
    icon: "gift",
    color: colors.green,
    description: "Tirage au sort et cadeaux entre amis",
  },
  {
    type: "birthday",
    label: "Anniversaire",
    icon: "cake-candles",
    color: colors.orange,
    description: "Organisez une surprise pour un proche",
  },
  {
    type: "christmasList",
    label: "Liste de Noël",
    icon: "tree",
    color: "#2e7d32",
    description: "Partagez vos envies de cadeaux",
  },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScreenWithMenu title="Gift Squad">
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.welcome}>
            Bienvenue {user?.pseudo || user?.firstname || ""} !
          </Text>
          <Text style={styles.tagline}>
            Organisez vos événements cadeaux en toute simplicité
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nos activités</Text>
        </View>

        <View style={styles.cardsContainer}>
          {ACTIVITIES.map((activity) => (
            <TouchableOpacity
              key={activity.type}
              style={styles.activityCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(main)/(newEvent)/createEvent",
                  params: { type: activity.type },
                })
              }
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: activity.color + "18" },
                ]}
              >
                <FontAwesome6
                  name={activity.icon}
                  size={28}
                  color={activity.color}
                />
              </View>
              <Text style={styles.cardLabel}>{activity.label}</Text>
              <Text style={styles.cardDescription}>
                {activity.description}
              </Text>
            </TouchableOpacity>
          ))}
          <SubmitButton
            text="Voir mes événements"
            onPress={() => router.push("/(main)/events")}
          />
        </View>
      </ScrollView>
    </ScreenWithMenu>
  );
}
