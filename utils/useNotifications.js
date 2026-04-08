// useNotifications: registers push notifications and sends the token to the backend.
// Skipped in Expo Go (notifications not supported there).
// When user taps a notification, navigates to the invitations screen.

import { useEffect, useRef } from "react";
import { Platform, LogBox } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import api from "./api";
import { useAuth } from "../context/AuthContext";

const isExpoGo = Constants.executionEnvironment === "expoGo";

// Suppress expo-notifications warnings in Expo Go
if (isExpoGo) {
  LogBox.ignoreLogs([
    "expo-notifications",
    "`expo-notifications` functionality is not fully supported",
  ]);
}

export default function useNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const responseListener = useRef();

  useEffect(() => {
    // Skip if no user logged in or running in Expo Go
    if (!user || isExpoGo) return;

    const setup = async () => {
      try {
        // Dynamic require to avoid crashes in Expo Go
        const Notifications = require("expo-notifications");
        const Device = require("expo-device");

        // Configure how notifications appear when app is in foreground
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        if (!Device.isDevice) return;

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

        console.log("Push token:", pushToken);
        await api.put(`/user/modify/${user._id}`, { pushToken });

        // When user taps a notification, navigate to invitations
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(() => {
            router.push("/(main)/invitations");
          });
      } catch (error) {
        console.log("Notifications setup skipped:", error.message);
      }
    };

    setup();

    // Cleanup listener on unmount
    return () => {
      if (responseListener.current) {
        try {
          const N = require("expo-notifications");
          N.removeNotificationSubscription(responseListener.current);
        } catch {}
      }
    };
  }, [user]);
}
