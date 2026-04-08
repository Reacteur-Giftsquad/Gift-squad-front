import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import colors from "../assets/colors/colors.json";
const navigationBar = Constants.statusBarHeight;

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
    paddingBlockEnd: 270 + navigationBar,
  },
  collectedText: {
    fontSize: 14,
    color: "#666",
  },
  giftCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    overflow: "hidden",
  },
  giftImage: {
    width: 100,
    height: 100,
  },
  giftImagePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  giftInfo: {
    flex: 1,
    padding: 12,
    gap: 5,
  },
  giftName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  giftPrice: {
    fontSize: 16,
    color: colors.green,
    fontStyle: "italic",
  },
  giftActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
});
