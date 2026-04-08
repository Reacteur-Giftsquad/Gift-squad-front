// RootNavigator: auth guard that redirects users based on login state.
// Logged-in users are sent to dashboard, logged-out users to login screen.

import { useEffect } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // Redirect based on auth state whenever it changes
  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;

    const inAuth = segments[0] === "(auth)";

    // Logged in but on auth screen -> go to dashboard
    if (token && user && inAuth) {
      router.replace("/(main)/dashboard");
    // Not logged in but on a protected screen -> go to login
    } else if ((!token || !user) && !inAuth) {
      router.replace("/");
    }
  }, [token, user, isLoading, segments, navigationState?.key]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
