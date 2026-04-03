import { StyleSheet } from "react-native";
import Constants from "expo-constants";
const navigationBar = Constants.statusBarHeight;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    gap: 25,
    padding: 20,
    paddingBlockEnd: navigationBar,
  },
  scrollContent: {
    padding: 20,
    gap: 25,
    paddingBlockEnd: 170 + navigationBar,
  },
  center: {
    alignItems: "center",
    gap: 10,
  },
  gap: {
    gap: 15,
  },
});
