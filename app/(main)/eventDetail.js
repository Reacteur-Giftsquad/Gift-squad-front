import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
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
import styles from "../../styles/eventDetailStyles";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [contributions, setContributions] = useState([]);
  const [showDrawModal, setShowDrawModal] = useState(false);

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
      await api.post(`/invitation/send`, {
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

  const isSecretSanta = event.type === "Secret Santa";
  const totalCollected = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const participatingCount = contributions.length;

  const handleConfirmDraw = async () => {
    setShowDrawModal(false);
    try {
      await api.post(`/events/draw/${id}`);
      Alert.alert("Succes", "Le tirage au sort a été effectué !");
      fetchEvent();
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
  };

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
                {isSecretSanta
                  ? `BUDGET CONSEILLÉ : ${event.budget}€`
                  : `€ ${totalCollected} COLLECTÉS`}
              </Text>
              {!isSecretSanta && (
                <Text style={styles.budgetSub}>
                  {participatingCount}/{event.members?.length || 0} PARTICIPANTS PARTICIPENT
                </Text>
              )}
            </View>
          )}

          {!isSecretSanta && (
            <SubmitButton
              text="Liste de cadeaux"
              icon={<FontAwesome6 name="gift" size={20} color="white" />}
              onPress={() =>
                router.push({
                  pathname: "/(main)/giftList",
                  params: { eventId: id, eventName: event.name },
                })
              }
            />
          )}
        </View>

        <View style={styles.participantsSection}>
          <Title text="PARTICIPANTS" heading="h2" />

          {[...(event.members || [])].sort((a) => a.user?._id === user._id ? -1 : 1).map((item, index) => {
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
                {!isSecretSanta && (
                  contribution ? (
                    <Text style={styles.contributionBadge}>
                      {contribution.amount}€
                    </Text>
                  ) : isYou ? (
                    <TouchableOpacity style={styles.participateBtn}>
                      <Text style={styles.participateBtnText}>Participer</Text>
                    </TouchableOpacity>
                  ) : (
                    <MaterialIcons name="hourglass-empty" size={20} color={colors.gray} />
                  )
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

        {isSecretSanta && (
          <View style={styles.drawSection}>
            <Text style={styles.warningText}>
              <Text style={{ fontWeight: "bold" }}>Attention : </Text>
              Une fois le tirage effectué, il ne sera plus possible de modifier la liste des participants.
            </Text>
            <SubmitButton
              text="Effectuer le tirage au sort"
              onPress={() => setShowDrawModal(true)}
            />
          </View>
        )}
      </ScrollView>

      <Modal visible={showDrawModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CONFIRMATION DU TIRAGE</Text>
              <TouchableOpacity onPress={() => setShowDrawModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalWarningIcon}>&#9888;</Text>

            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir effectuer le tirage au sort ?
            </Text>
            <Text style={styles.modalTextBold}>
              Attention : <Text style={{ fontWeight: "normal" }}>Cette action est irréversible.</Text>
            </Text>

            <View style={styles.modalBullets}>
              <Text style={styles.modalBullet}>•  Tous les participants seront notifiés par email</Text>
              <Text style={styles.modalBullet}>•  Il ne sera plus possible d'ajouter de nouveaux participants</Text>
              <Text style={styles.modalBullet}>•  Le résultat du tirage sera définitif</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDrawModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmDraw}
              >
                <Text style={styles.modalConfirmText}>Confirmer le tirage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
