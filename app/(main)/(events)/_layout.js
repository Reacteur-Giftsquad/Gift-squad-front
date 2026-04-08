import { Stack } from "expo-router";
import colors from "../../../assets/colors/colors.json";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.green,
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      }}>
      <Stack.Screen name="events" options={{ headerShown: false }} />
      <Stack.Screen
        name="eventDetail"
        options={({ route }) => ({
          title: route.params?.title.toUpperCase(),
        })}
      />
      <Stack.Screen
        name="wishList"
        options={({ route }) => ({
          title:
            route.params.isOwn === "true"
              ? "Ma liste de souhaits".toUpperCase()
              : `Liste de ${route.params?.ownerName}`.toUpperCase(),
        })}
      />
      <Stack.Screen name="giftList" options={{ title: "LISTE DE CADEAUX" }} />
      <Stack.Screen
        name="giftDetails"
        options={{ title: "DÉTAIL DU CADEAUX" }}
      />
      <Stack.Screen name="addGift" options={{ title: "AJOUTER UN SOUHAIT" }} />
      <Stack.Screen
        name="editGift"
        options={({ route }) => ({
          title:
            route.params.mode === "wish"
              ? "Modifier mon souhait".toUpperCase()
              : "Modifier un cadeau".toUpperCase(),
        })}
      />
    </Stack>
  );
}
