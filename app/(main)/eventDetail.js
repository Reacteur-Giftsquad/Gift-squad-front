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
  KeyboardAvoidingView,
  Platform,
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
import { useBehavior } from "../../utils/useBehavior";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [contributions, setContributions] = useState([]);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showContribModal, setShowContribModal] = useState(false);
  const [contribAmount, setContribAmount] = useState("");
  const behaviour = useBehavior();

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);

      try {
        const contribRes = await api.get(`/contribution/event/${id}`);
        setContributions(contribRes.data || []);
      } catch {}
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
  const isChristmasList = event.type === "Liste de Noël";
  const isCreator = event.creator?._id === user._id;
  const isDrawn = event.status === "drawn";
  const myDraw = event.secret_Santa_Draw?.find(
    (d) => (d.giver?._id || d.giver) === user._id,
  );
  const totalCollected = contributions.reduce(
    (sum, c) => sum + (c.amount || 0),
    0,
  );
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

  const handleContribute = async () => {
    const amount = Number(contribAmount);
    if (!amount || amount <= 0) {
      return Alert.alert("Erreur", "Veuillez entrer un montant valide");
    }
    try {
      await api.post("/contribution/create", {
        event: id,
        user: user._id,
        amount,
      });
      setShowContribModal(false);
      setContribAmount("");
      fetchEvent();
    } catch (error) {
      Alert.alert("Erreur", error.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={behaviour}
      enabled={Platform.OS === "android"}
      style={styles.container}>
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

          {!isChristmasList && event.budget > 0 && (
            <View style={styles.budgetBar}>
              <Text style={styles.budgetAmount}>
                {isSecretSanta
                  ? `BUDGET CONSEILLÉ : ${event.budget}€`
                  : `€ ${totalCollected} COLLECTÉS`}
              </Text>
              {!isSecretSanta && (
                <Text style={styles.budgetSub}>
                  {participatingCount}/{event.members?.length || 0} PARTICIPANTS
                  PARTICIPENT
                </Text>
              )}
            </View>
          )}

          {isDrawn && myDraw && (
            <View style={styles.drawResultBar}>
              <Text style={styles.drawResultText}>
                VOUS AVEZ TIRÉ{" "}
                <Text style={styles.drawResultName}>
                  {myDraw.receiver?.pseudo || myDraw.receiver?.firstname}
                </Text>
              </Text>
            </View>
          )}

          {!isSecretSanta && !isChristmasList && (
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

          {[...(event.members || [])]
            .sort((a) => (a.user?._id === user._id ? -1 : 1))
            .map((item, index) => {
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
                    {isYou && <Text style={styles.youLabel}> (vous)</Text>}
                  </Text>
                  {isChristmasList && (
                    <TouchableOpacity
                      style={styles.participateBtn}
                      onPress={() =>
                        router.push({
                          pathname: "/(main)/wishList",
                          params: {
                            eventId: id,
                            ownerId: member._id,
                            ownerName: member.pseudo || member.firstname,
                            isOwn: isYou ? "true" : "false",
                          },
                        })
                      }>
                      <FontAwesome6
                        name="gift"
                        size={14}
                        color="white"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.participateBtnText}>
                        {isYou ? "Ma liste" : "Liste de souhaits"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {isSecretSanta && isDrawn && !isYou && (
                    <MaterialIcons
                      name="visibility"
                      size={22}
                      color={colors.green}
                    />
                  )}
                  {!isSecretSanta &&
                    !isChristmasList &&
                    (contribution ? (
                      <Text style={styles.contributionBadge}>
                        {contribution.amount}€
                      </Text>
                    ) : isYou ? (
                      <TouchableOpacity
                        style={styles.participateBtn}
                        onPress={() => setShowContribModal(true)}>
                        <Text style={styles.participateBtnText}>
                          Participer
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <MaterialIcons
                        name="hourglass-empty"
                        size={20}
                        color={colors.gray}
                      />
                    ))}
                </View>
              );
            })}

          {isCreator && (
            <>
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
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAddParticipant}>
                  <MaterialIcons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {isSecretSanta && (
          <View style={styles.drawSection}>
            {isDrawn ? (
              <View style={styles.drawDoneBtn}>
                <Text style={styles.drawDoneText}>Tirage au sort effectué</Text>
              </View>
            ) : isCreator ? (
              <>
                <Text style={styles.warningText}>
                  <Text style={{ fontWeight: "bold" }}>Attention : </Text>
                  Une fois le tirage effectué, il ne sera plus possible de
                  modifier la liste des participants.
                </Text>
                <SubmitButton
                  text="Effectuer le tirage au sort"
                  onPress={() => setShowDrawModal(true)}
                />
              </>
            ) : null}
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
              Attention :{" "}
              <Text style={{ fontWeight: "normal" }}>
                Cette action est irréversible.
              </Text>
            </Text>

            <View style={styles.modalBullets}>
              <Text style={styles.modalBullet}>
                • Tous les participants seront notifiés par email
              </Text>
              <Text style={styles.modalBullet}>
                • Il ne sera plus possible d'ajouter de nouveaux participants
              </Text>
              <Text style={styles.modalBullet}>
                • Le résultat du tirage sera définitif
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDrawModal(false)}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmDraw}>
                <Text style={styles.modalConfirmText}>Confirmer le tirage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showContribModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>VOTRE PARTICIPATION</Text>
              <TouchableOpacity onPress={() => setShowContribModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalText, { fontWeight: "bold" }]}>
              Combien voulez-vous donner ?
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#d1d1d1",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                marginVertical: 16,
              }}
              placeholder="Montant en €"
              keyboardType="numeric"
              value={contribAmount}
              onChangeText={(v) => setContribAmount(v.replace(/[^0-9]/g, ""))}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#4ead51",
                borderRadius: 8,
                padding: 14,
                alignItems: "center",
                width: "100%",
              }}
              onPress={handleContribute}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
                Confirmer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
