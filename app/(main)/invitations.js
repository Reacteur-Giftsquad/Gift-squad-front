import { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ScreenWithMenu from "../../components/ScreenWithMenu";
import Title from "../../components/Title";
import Icon from "../../components/Icon";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import convertDate from "../../utils/convertDate";
import styles from "../../styles/invitationsStyles";

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
        action === "accept"
          ? "Invitation acceptée !"
          : "Invitation refusée.",
      );
      fetchInvitations();
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
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
          <TouchableOpacity
            style={styles.refuseBtn}
            onPress={() => handleRespond(item._id, "refuse")}
          >
            <MaterialIcons name="close" size={20} color="white" />
            <Text style={styles.refuseText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleRespond(item._id, "accept")}
          >
            <MaterialIcons name="check" size={20} color="white" />
            <Text style={styles.acceptText}>Accepter</Text>
          </TouchableOpacity>
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
          <ActivityIndicator size="large" color={colors.green} />
        ) : pendingInvitations.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="mail-outline" size={60} color={colors.lightgray} />
            <Text style={styles.emptyText}>Aucune invitation en attente</Text>
          </View>
        ) : (
          <FlatList
            data={pendingInvitations}
            keyExtractor={(item) => item._id}
            renderItem={renderInvitation}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </ScreenWithMenu>
  );
}
