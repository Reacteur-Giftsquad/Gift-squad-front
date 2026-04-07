import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import colors from "../assets/colors/colors.json";

export default StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
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
  drawResultBar: {
    backgroundColor: "#fff8e1",
    borderWidth: 2,
    borderColor: "#f0c040",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  drawResultText: {
    fontSize: 16,
    color: "#e65100",
    fontWeight: "600",
  },
  drawResultName: {
    fontWeight: "bold",
    color: "#e65100",
  },
  drawDoneBtn: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  drawDoneText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  drawSection: {
    marginTop: 20,
    gap: 15,
  },
  warningText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
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
    marginBottom: 15,
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
