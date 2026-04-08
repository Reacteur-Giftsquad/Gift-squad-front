import { StyleSheet } from "react-native";
import colors from "../assets/colors/colors.json";
import Constants from "expo-constants";

const navigationBar = Constants.statusBarHeight;

export default StyleSheet.create({
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
});
