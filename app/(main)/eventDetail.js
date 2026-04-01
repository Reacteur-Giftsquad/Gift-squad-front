import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import convertDate from "../../utils/convertDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SubmitButton from "../../components/SubmitButton";
import Title from "../../components/Title";
import Constants from "expo-constants";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [contributions, setContributions] = useState([]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);

      // Fetch contributions for this event
      try {
        const contribRes = await api.get(`/contributions`, {
          params: { eventId: id },
        });
        setContributions(contribRes.data || []);
      } catch {
        // contributions route may not exist yet
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger l'événement");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleAddParticipant = async () => {
    if (!email) return;
    try {
      await api.post(`/invitations/create`, {
        eventId: id,
        senderEmail: user.email,
        receiverEmail: email,
      });
      Alert.alert("Succes", "Invitation envoyée !");
      setEmail("");
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  if (!event) return null;

  const totalCollected = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const participatingCount = contributions.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{event.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.dateBar}>
            <MaterialIcons name="calendar-month" size={20} color="white" />
            <Text style={styles.dateText}>{convertDate(event.date)}</Text>
          </View>

          {event.budget > 0 && (
            <View style={styles.budgetBar}>
              <Text style={styles.budgetAmount}>
                € {totalCollected} COLLECTÉS
              </Text>
              <Text style={styles.budgetSub}>
                {participatingCount}/{event.members?.length || 0} PARTICIPANTS PARTICIPENT
              </Text>
            </View>
          )}

          <SubmitButton
            text="Liste de cadeaux"
            icon={<FontAwesome6 name="gift" size={20} color="white" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.participantsSection}>
          <Title text="PARTICIPANTS" heading="h2" />

          {(event.members || []).map((item, index) => {
            const member = item.user;
            if (!member) return null;
            const isYou = member._id === user._id;
            const contribution = contributions.find(
              (c) => c.user === member._id || c.user?._id === member._id,
            );

            return (
              <View key={member._id || index} style={styles.participantRow}>
                <Text style={styles.participantName}>
                  {member.pseudo || member.firstname}
                  {isYou && <Text style={styles.youLabel}>  (vous)</Text>}
                </Text>
                {contribution ? (
                  <Text style={styles.contributionBadge}>
                    {contribution.amount}€
                  </Text>
                ) : isYou ? (
                  <TouchableOpacity style={styles.participateBtn}>
                    <Text style={styles.participateBtnText}>Participer</Text>
                  </TouchableOpacity>
                ) : (
                  <MaterialIcons name="hourglass-empty" size={20} color={colors.gray} />
                )}
              </View>
            );
          })}

          <Text style={styles.addLabel}>Ajouter un participant</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Email du participant"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddParticipant}>
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.green,
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    flex: 1,
  },
  content: {
    padding: 15,
    gap: 15,
    paddingBottom: 30,
  },
  topSection: {
    gap: 15,
  },
  participantsSection: {
    marginTop: 10,
    gap: 5,
  },
  dateBar: {
    backgroundColor: colors.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
  },
  dateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  budgetBar: {
    borderWidth: 2,
    borderColor: "#f0c040",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  budgetAmount: {
    color: "#f0a020",
    fontSize: 18,
    fontWeight: "bold",
  },
  budgetSub: {
    color: "#f0a020",
    fontSize: 12,
    marginTop: 4,
  },
  participantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  participantName: {
    fontSize: 16,
  },
  youLabel: {
    color: colors.gray,
    fontStyle: "italic",
    fontSize: 14,
  },
  contributionBadge: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  participateBtn: {
    backgroundColor: colors.green,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  participateBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  addLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },
  addBtn: {
    backgroundColor: colors.green,
    borderRadius: 8,
    padding: 10,
  },
});
