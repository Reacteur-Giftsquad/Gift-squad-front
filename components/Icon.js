import { View } from "react-native";
import colors from "../assets/colors/colors.json";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ICON_MAP = {
  "Secret Santa": { name: "gift", color: colors.green },
  "Liste de Noël": { name: "tree", color: "#2e7d32" },
  "Anniversaire": { name: "cake-candles", color: colors.orange },
};

export default function Icon({ type, size = 40 }) {
  const { name, color } = ICON_MAP[type] || ICON_MAP["Secret Santa"];
  return (
    <View
      style={{
        width: size + 16,
        height: size + 16,
        borderRadius: (size + 16) / 2,
        backgroundColor: color + "18",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <FontAwesome6 name={name} size={size} color={color} />
    </View>
  );
}
