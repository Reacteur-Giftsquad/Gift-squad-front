// useNotifications: registers push notifications and sends the token to the backend.
// When user taps a notification, navigates to the invitations screen.

import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import api from "./api";
import { useAuth } from "../context/AuthContext";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function useNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const responseListener = useRef();

  useEffect(() => {
    if (!user || !Device.isDevice) return;

    const setup = async () => {
      try {
        // Request notification permissions
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") return;

        // Android requires a notification channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }

        // Get the Expo push token and save it to the backend
        const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });

        await api.put(`/user/modify/${user._id}`, { pushToken }, { timeout: 15000 });

        // When user taps a notification, navigate to invitations
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(() => {
            router.push("/(main)/invitations");
          });
      } catch (error) {
        // Notifications not available (e.g. Expo Go)
      }
    };

    setup();

    return () => {
      responseListener.current.remove();
    };
  }, [user]);
}
