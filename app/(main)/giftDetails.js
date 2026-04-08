import { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import colors from "../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SubmitButton from "../../components/SubmitButton";
import Title from "../../components/Title";
import Constants from "expo-constants";
const navigationBar = Constants.statusBarHeight;

export default function GiftDetails() {
  const {
    giftId,
    giftName,
    giftDescription,
    giftLink,
    giftImage,
    assignedTo,
    isAssigned,
  } = useLocalSearchParams();
  const [showReserveModal, setShowReserveModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const isReservedByMe =
    assignedTo === user._id || assignedTo?._id === user._id;
  const isReservedByOther = isAssigned && !isReservedByMe;

  const handleReserve = async () => {
    setShowReserveModal(false);
    try {
      await api.post(`/gift/${giftId}/reserve`, {
        userId: user._id,
      });
      Alert.alert("Succes", "Tu as réservé ce cadeau !");
      router.back();
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de réserver ce cadeau");
      }
    }
  };
  const handleUnreserve = async () => {
    try {
      await api.post(`/gift/${giftId}/unreserve`);
      router.back();
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de annuler la réservation de ce cadeau",
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du cadeau</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {giftImage ? (
          <Image source={{ uri: giftImage }} style={styles.giftImage} />
        ) : (
          <View style={[styles.giftImage, styles.giftImagePlaceholder]}>
            <MaterialIcons name="card-giftcard" size={40} color={colors.gray} />
          </View>
        )}
        <Title text={`${giftName || ""}`} heading="h1" />
        <Text style={styles.giftDescription}>{giftDescription}</Text>
        {giftLink && <SubmitButton text="Voir sur le site" />}
        {isReservedByOther ? (
          <Text>Ce cadeau est déjà réservé</Text>
        ) : isReservedByMe ? (
          <SubmitButton
            bgColor={colors.red}
            text="Annuler la réservation"
            onPress={handleUnreserve}
          />
        ) : (
          <SubmitButton
            text="Réserver ce cadeau"
            onPress={() => setShowReserveModal(true)}
          />
        )}
      </View>

      <Modal visible={showReserveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>RÉSERVER UN CADEAU</Text>
              <TouchableOpacity onPress={() => setShowReserveModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalWarningIcon}>&#9888;</Text>

            <Text style={styles.modalText}>
              Voulez-vous vous occuper de ce cadeau ?
            </Text>
            <Text style={styles.modalTextBold}>{giftName}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReserveModal(false)}>
                <Text style={styles.modalCancelText}>Non</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleReserve}>
                <Text style={styles.modalConfirmText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  giftCard: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  imageBox: {
    overflow: "hidden",
  },
  giftImage: {
    borderRadius: 8,
    width: "80%",
    aspectRatio: 4 / 3,
  },
  giftImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  giftInfo: {
    alignSelf: "flex-start",
    flex: 1,
    paddingInline: 12,
    gap: 5,
  },
  giftName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  giftDescription: {
    fontSize: 16,
    alignSelf: "left",
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
    gap: 25,
    paddingBlockEnd: 270 + navigationBar,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalWarningIcon: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 10,
    color: "#f0a020",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  modalTextBold: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
  },
  modalBullets: {
    gap: 8,
    marginBottom: 25,
  },
  modalBullet: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  modalCancelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
