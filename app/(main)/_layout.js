import { Stack } from "expo-router";
import useNotifications from "../../utils/useNotifications";

export default function MainLayout() {
  useNotifications();
  return <Stack screenOptions={{ headerShown: false }} />;
}
