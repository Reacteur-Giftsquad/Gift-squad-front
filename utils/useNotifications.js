import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import api from "./api";
import { useAuth } from "../context/AuthContext";

const isExpoGo = Constants.executionEnvironment === "expoGo";

export default function useNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const responseListener = useRef();

  useEffect(() => {
    if (!user || isExpoGo) return;

    let Notifications;
    let Device;

    const registerPushToken = async () => {
      Notifications = require("expo-notifications");
      Device = require("expo-device");

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      if (!Device.isDevice) {
        console.log("Push notifications require a physical device");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission denied");
        return;
      }

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

      try {
        await api.put(`/user/modify/${user._id}`, { pushToken });
      } catch (error) {
        console.log("Failed to save push token:", error.message);
      }
    };

    registerPushToken();

    // Lazy load for tap listener
    const setupListener = async () => {
      if (!Notifications) Notifications = require("expo-notifications");
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(() => {
          router.push("/(main)/invitations");
        });
    };
    setupListener();

    return () => {
      if (responseListener.current) {
        const N = require("expo-notifications");
        N.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);
}
