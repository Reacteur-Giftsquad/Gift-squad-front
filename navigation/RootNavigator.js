import { Stack } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { token, user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!token || !user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={token && user}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
    </Stack>
  );
}
