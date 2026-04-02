import { Text } from "react-native";
import colors from "../assets/colors/colors.json";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ICON_MAP = {
  "Secret Santa": "gift",
  "Liste de Noël": "tree",
  "Anniversaire": "cake-candles",
};

export default function Icon({ type }) {
  const iconName = ICON_MAP[type] || "gift";
  return (
    <Text>
      <FontAwesome6 name={iconName} size={40} color={colors.green} />
    </Text>
  );
}
