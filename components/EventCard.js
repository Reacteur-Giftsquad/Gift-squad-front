import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";
import convertDate from "../utils/convertDate";
import Icon from "./Icon";

export default function EventCard({ event }) {
  return (
    <View style={styles.container}>
      <View style={styles.giftAndData}>
        <Icon type="gift" />
        <View style={styles.eventData}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.type}>{event.type}</Text>
          <View style={styles.date}>
            <Text>
              <MaterialIcons
                name="calendar-month"
                size={20}
                color={colors.lightgray}
              />
            </Text>
            <Text style={styles.dateText}>{convertDate(event.date)}</Text>
          </View>
        </View>
      </View>
      <Text>
        <MaterialIcons name="arrow-forward-ios" size={24} color={colors.gray} />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    gap: 20,
  },
  giftAndData: {
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 20,
  },
  eventData: {
    flexDirection: "column",
    color: colors.lightgray,
    gap: 5,
  },
  type: {
    fontSize: 16,
    color: colors.lightgray,
  },
  date: {
    flexDirection: "row",
    alignItems: "center",
    color: colors.lightgray,
    gap: 10,
  },
  dateText: {
    color: colors.lightgray,
  },
});
