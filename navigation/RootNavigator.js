import { useEffect } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;

    const inAuth = segments[0] === "(auth)";

    if (token && user && inAuth) {
      router.replace("/(main)/dashboard");
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
