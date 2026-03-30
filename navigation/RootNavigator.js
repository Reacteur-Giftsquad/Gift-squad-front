import { Stack } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { user, token } = useAuth();

  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!token || !user}>
      <Stack.Screen name="(auth)"></Stack.Screen>
    </Stack.Protected>
    <Stack.Protected guard={token && user}>
      <Stack.Screen name="(main)"></Stack.Screen>
    </Stack.Protected>
  </Stack>;
}
