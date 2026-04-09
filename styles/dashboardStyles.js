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
    paddingTop: Constants.statusBarHeight + 10,
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
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: colors.green,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 35,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.lightgray,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: colors.green,
    marginHorizontal: 20,
    marginTop: 28,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.green,
  },
  secondaryButtonText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
