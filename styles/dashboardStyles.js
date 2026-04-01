import { StyleSheet, Dimensions } from "react-native";
import Constants from "expo-constants";
import colors from "../assets/colors/colors.json";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menu: {
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
});
