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
    if (!user || isExpoGo) return;

    const setup = async () => {
      try {
        const Notifications = require("expo-notifications");
        const Device = require("expo-device");

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });

        if (!Device.isDevice) return;

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") return;

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }

        const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });

        console.log("Push token:", pushToken);
        await api.put(`/user/modify/${user._id}`, { pushToken });

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(() => {
            router.push("/(main)/invitations");
          });
      } catch (error) {
        console.log("Notifications setup skipped:", error.message);
      }
    };

    setup();

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
