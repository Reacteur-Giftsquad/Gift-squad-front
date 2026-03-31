import { Text } from "react-native";
import colors from "../assets/colors/colors.json";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Icon({ type }) {
  return (
    <Text>
      <FontAwesome6 name={type} size={40} color={colors.green} />
    </Text>
  );
}
