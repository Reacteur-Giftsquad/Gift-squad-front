import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import ScreenWithMenu from "../../components/ScreenWithMenu";
import styles from "../../styles/dashboardStyles";

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <ScreenWithMenu title="Gift Squad">
      <View style={styles.content}>
        <Text style={styles.welcome}>
          Bienvenue {user?.pseudo || user?.firstname || ""}
        </Text>
        <Text style={styles.subtitle}>Ne t'en fais pas</Text>
        <Text style={styles.subtitle}>Secret Santa est la pour toi !</Text>
      </View>
    </ScreenWithMenu>
  );
}
