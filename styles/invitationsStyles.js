import { StyleSheet } from "react-native";
import colors from "../assets/colors/colors.json";

export default StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  list: {
    gap: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.green,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: colors.lightgray,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  refuseBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.red,
  },
  refuseText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.green,
  },
  acceptText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 15,
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightgray,
  },
});
