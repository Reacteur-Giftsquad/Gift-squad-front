// GiftDetails: detail view of a wish from someone else's list.
// Users can reserve or unreserve a gift from this screen.
import { useState } from "react";
import { View, Text, Image, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../utils/api";
import showError from "../../../utils/showError";
import { useAuth } from "../../../context/AuthContext";
import colors from "../../../assets/colors/colors.json";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SubmitButton from "../../../components/SubmitButton";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Title from "../../../components/Title";
import Feather from "@expo/vector-icons/Feather";
import styles from "../../../styles/giftDetailsStyles";

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
  const isReservedByOther = isAssigned === "true" && !isReservedByMe;

  const handleReserve = async () => {
    setShowReserveModal(false);
    try {
      await api.post(`/gift/${giftId}/reserve`, {
        userId: user._id,
      });
      Alert.alert("Succes", "Tu as réservé ce cadeau !");
      router.back();
    } catch (error) {
      showError(error, "Impossible de réserver ce cadeau");
    }
  };
  const handleUnreserve = async () => {
    try {
      await api.post(`/gift/${giftId}/unreserve`);
      router.back();
    } catch (error) {
      showError(error, "Impossible d'annuler la réservation de ce cadeau");
    }
  };
  return (
    <View style={styles.container}>
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

        {giftLink && (
          <SubmitButton
            onPress={() => Linking.openURL(giftLink)}
            text="Voir sur le site"
            icon={<Feather name="external-link" size={24} color="white" />}
          />
        )}
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

      <ConfirmationModal
        visible={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        onConfirm={handleReserve}
        title="RÉSERVER UN CADEAU"
        cancelText="Non"
        confirmText="OK">
        <Text style={styles.modalWarningIcon}>&#9888;</Text>
        <Text style={styles.modalText}>
          Voulez-vous vous occuper de ce cadeau ?
        </Text>
        <Text style={styles.modalTextBold}>{giftName}</Text>
      </ConfirmationModal>
    </View>
  );
}
