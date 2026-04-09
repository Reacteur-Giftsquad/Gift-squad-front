// EventDetail: shows full details of an event.
// Adapts UI based on event type:
//   - Secret Santa: shows draw button (creator only) and draw results
//   - Birthday: shows gift list + contribution system
//   - Christmas List: shows each participant's wish list
// Creator can invite participants by email.

import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../../../utils/api";
import showError from "../../../utils/showError";
import { useAuth } from "../../../context/AuthContext";
import colors from "../../../assets/colors/colors.json";
import convertDate from "../../../utils/convertDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Loader from "../../../components/Loader";
import SubmitButton from "../../../components/SubmitButton";
import Title from "../../../components/Title";
import ConfirmationModal from "../../../components/ConfirmationModal";
import styles from "../../../styles/eventDetailStyles";

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [drawRevealed, setDrawRevealed] = useState(false);
  const scrollRef = useRef();

  const handleRemoveMember = (member) => {
    const name = member.pseudo || member.firstname;
    Alert.alert("Retirer", `Retirer "${name}" de l'événement ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Retirer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/events/${id}/remove-user/${member._id}`);
            fetchEvent();
          } catch (error) {
            showError(error, "Impossible de retirer ce participant");
          }
        },
      },
    ]);
  };

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);

      try {
        const contribRes = await api.get(`/contribution/event/${id}`);
        setContributions(contribRes.data || []);
      } catch (e) {
        showError(e, "Impossible de charger les contributions");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger l'événement");
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvent();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvent();
    setRefreshing(false);
  };

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
      showError(error);
    }
  };

  if (isLoading) return <Loader />;

  if (!event) return null;

  // Determine event type and user's role to adapt the UI
  const isSecretSanta = event.type === "Secret Santa";
  const isChristmasList = event.type === "Liste de Noël";
  const isCreator = event.creator?._id === user._id;
  const isDrawn = event.status === "drawn";
  // Find who the current user drew in a Secret Santa
  const myDraw = event.secret_Santa_Draw?.find(
    (d) => (d.giver?._id || d.giver) === user._id,
  );
  // Birthday contribution totals
  const totalCollected = contributions.reduce(
    (sum, c) => sum + (c.amount || 0),
    0,
  );
  const participatingCount = contributions.length;

  // Trigger the Secret Santa random draw (irreversible)
  const handleConfirmDraw = async () => {
    setShowDrawModal(false);
    try {
      await api.post(`/events/draw/${id}`);
      Alert.alert("Succes", "Le tirage au sort a été effectué !");
      fetchEvent();
    } catch (error) {
      showError(error);
    }
  };

  // Submit a monetary contribution for a birthday event
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
      showError(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.green]} />
        }>
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
                <TouchableOpacity
                  key={member._id || index}
                  activeOpacity={0.7}
                  onLongPress={isCreator && !isYou ? () => handleRemoveMember(member) : undefined}
                >
                <View style={styles.participantRow}>
                  <Text style={styles.participantName}>
                    {member.pseudo || member.firstname}
                    {isYou && <Text style={styles.youLabel}> (vous)</Text>}
                  </Text>
                  {isChristmasList && (
                    <SubmitButton
                      text={isYou ? "Ma liste" : "Liste de souhaits"}
                      fontSize="sm"
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
                      }
                      icon={
                        <FontAwesome6
                          name="gift"
                          size={14}
                          color="white"
                          style={{ marginRight: 6 }}
                        />
                      }
                    />
                  )}
                  {isSecretSanta && isDrawn && !isYou && (
                    <TouchableOpacity
                      onPress={() => {
                        const draw = event.secret_Santa_Draw?.find(
                          (d) => (d.giver?._id || d.giver) === member._id,
                        );
                        if (draw) setSelectedDraw({ giver: member, receiver: draw.receiver });
                      }}>
                      <MaterialIcons
                        name="visibility"
                        size={22}
                        color={colors.green}
                      />
                    </TouchableOpacity>
                  )}
                  {!isSecretSanta &&
                    !isChristmasList &&
                    (contribution ? (
                      <Text style={styles.contributionBadge}>
                        {contribution.amount}€
                      </Text>
                    ) : isYou ? (
                      <SubmitButton
                        text="Participer"
                        fontSize="sm"
                        onPress={() => setShowContribModal(true)}
                      />
                    ) : (
                      <MaterialIcons
                        name="hourglass-empty"
                        size={20}
                        color={colors.gray}
                      />
                    ))}
                </View>
                </TouchableOpacity>
              );
            })}

          {isCreator && !isDrawn && (
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
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)}
                />
                <SubmitButton
                  onPress={handleAddParticipant}
                  icon={<MaterialIcons name="add" size={24} color="white" />}
                />
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
            ) : (
              <Text style={styles.warningText}>
                Le tirage au sort n'a pas encore été effectué. L'organisateur s'en charge !
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        onConfirm={handleConfirmDraw}
        title="CONFIRMATION DU TIRAGE"
        confirmText="Confirmer le tirage">
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
            • Il ne sera plus possible d'ajouter de nouveaux participants
          </Text>
          <Text style={styles.modalBullet}>
            • Le résultat du tirage sera définitif
          </Text>
        </View>
      </ConfirmationModal>

      <ConfirmationModal
        visible={showContribModal}
        onClose={() => setShowContribModal(false)}
        onConfirm={handleContribute}
        title="VOTRE PARTICIPATION">
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
      </ConfirmationModal>

      <ConfirmationModal
        visible={!!selectedDraw}
        onClose={() => {
          setSelectedDraw(null);
          setDrawRevealed(false);
        }}
        onConfirm={() => {
          if (drawRevealed) {
            setSelectedDraw(null);
            setDrawRevealed(false);
          } else {
            setDrawRevealed(true);
          }
        }}
        title="TIRAGE AU SORT"
        confirmText={drawRevealed ? "OK" : "Oui"}
        cancelText={drawRevealed ? "Fermer" : "Non"}>
        {!drawRevealed ? (
          <Text style={styles.modalText}>
            Voulez-vous voir qui{" "}
            {selectedDraw?.giver?.pseudo || selectedDraw?.giver?.firstname} a tiré ?
          </Text>
        ) : (
          <>
            <Text style={styles.modalText}>
              {selectedDraw?.giver?.pseudo || selectedDraw?.giver?.firstname} a tiré :
            </Text>
            <Text style={[styles.modalTextBold, { fontSize: 20, textAlign: "center" }]}>
              {selectedDraw?.receiver?.pseudo || selectedDraw?.receiver?.firstname}
            </Text>
          </>
        )}
      </ConfirmationModal>
    </KeyboardAvoidingView>
  );
}
