// Invitations: shows pending event invitations the user has received.
// User can accept or refuse each invitation.

import { useEffect, useState, useCallback } from "react";
import { Text, View, FlatList, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loader from "../../components/Loader";
import ScreenWithMenu from "../../components/ScreenWithMenu";
import Title from "../../components/Title";
import Icon from "../../components/Icon";
import api from "../../utils/api";
import showError from "../../utils/showError";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import convertDate from "../../utils/convertDate";
import styles from "../../styles/invitationsStyles";
import SubmitButton from "../../components/SubmitButton";

export default function Invitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    try {
      const { data } = await api.get(`/invitation/${user._id}`);
      setInvitations(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les invitations");
    }
    setIsLoading(false);
  }, [user._id]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleRespond = async (invitationId, action) => {
    try {
      await api.post(`/invitation/${invitationId}/${action}`);
      Alert.alert(
        "Succès",
        action === "accept" ? "Invitation acceptée !" : "Invitation refusée.",
      );
      fetchInvitations();
    } catch (error) {
      showError(error);
    }
  };

  const pendingInvitations = invitations.filter((i) => i.status === "pending");

  const renderInvitation = ({ item }) => {
    const eventName = item.event?.name || "Événement inconnu";
    const eventType = item.event?.type || "";
    const senderName =
      item.sender?.pseudo || item.sender?.firstname || "Quelqu'un";
    const eventDate = item.event?.date ? convertDate(item.event.date) : "";

    return (
      <View style={styles.card}>
        <Text style={styles.eventName}>{eventName}</Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Icon type={eventType} />
            <View>
              <Text style={styles.detailText}>De: {senderName}</Text>
              {eventDate ? (
                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="calendar-month"
                    size={14}
                    color={colors.lightgray}
                  />
                  <Text style={styles.dateText}>{eventDate}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <SubmitButton
            text="Refuser"
            onPress={() => handleRespond(item._id, "refuse")}
            bgColor={colors.red}
            flex
            icon={<MaterialIcons name="close" size={20} color="white" />}
          />
          <SubmitButton
            text="Accepter"
            onPress={() => handleRespond(item._id, "accept")}
            flex
            icon={<MaterialIcons name="check" size={20} color="white" />}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenWithMenu title="Invitations">
      <View style={styles.content}>
        <Title
          text={`VOUS AVEZ ${pendingInvitations.length} INVITATION${pendingInvitations.length > 1 ? "S" : ""}`}
          heading="h1"
        />

        {isLoading ? (
          <Loader />
        ) : pendingInvitations.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons
              name="mail-outline"
              size={60}
              color={colors.lightgray}
            />
            <Text style={styles.emptyText}>Aucune invitation en attente</Text>
          </View>
        ) : (
          <FlatList
            data={pendingInvitations}
            keyExtractor={(item) => item._id}
            renderItem={renderInvitation}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenWithMenu>
  );
}
