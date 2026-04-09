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
  content: {
    padding: 15,
    gap: 15,
    paddingBlockEnd: 270 + navigationBar,
  },
  collectedText: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 20,
    textAlign: "center",
    padding: 50,
    color: colors.lightgray,
  },
});
