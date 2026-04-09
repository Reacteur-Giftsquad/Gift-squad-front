// ConfirmationModal: reusable modal with confirm/cancel buttons.
// Pass children as the modal body content.

import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";
import SubmitButton from "./SubmitButton";

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  children,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {children}

          <View style={styles.buttons}>
            {onClose && (
              <SubmitButton
                text={cancelText}
                onPress={onClose}
                bgColor={colors.red}
                flex
              />
            )}
            <SubmitButton text={confirmText} onPress={onConfirm} flex />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
});
