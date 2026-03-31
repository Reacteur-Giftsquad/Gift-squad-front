import { StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors/colors.json";
import Constants from "expo-constants";

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.green,
    // paddingBlock: 20,
    paddingBlockStart: Constants.statusBarHeight,
    paddingBlockEnd: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default Header;
