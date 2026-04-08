import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import colors from "../assets/colors/colors.json";
const navigationBar = Constants.statusBarHeight;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    gap: 15,
    paddingBottom: 30 + navigationBar,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  imagePreview: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  previewImage: {
    height: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },
  previewText: {
    color: colors.gray,
    marginTop: 5,
  },
});
