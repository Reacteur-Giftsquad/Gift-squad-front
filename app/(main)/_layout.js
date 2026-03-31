import Drawer from "expo-router/drawer";
import colors from "../../assets/colors/colors.json";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerRight: () => (
          <FontAwesome
            name="envelope"
            size={24}
            color="white"
            style={{ paddingInlineEnd: 10 }}
          />
        ),
        headerStyle: { backgroundColor: colors.green },
        headerTintColor: "white",
        headerTitleStyle: {
          textTransform: "uppercase",
        },
        headerTitleAlign: "center",
        drawerActiveTintColor: colors.gray,
        drawerInactiveTintColor: colors.gray,
        drawerActiveBackgroundColor: "transparent",
        drawerContentStyle: {
          alignContent: "center",
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Mes événements",
          title: "Mes événements",
          drawerIcon: () => (
            <MaterialIcons
              name="calendar-month"
              size={24}
              color={colors.gray}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="createEvent"
        options={{
          drawerLabel: "Créer un événement",
          title: "Créer un événement",
          drawerIcon: () => (
            <MaterialIcons name="add" size={24} color={colors.gray} />
          ),
        }}
      />
      <Drawer.Screen
        name="invitations"
        options={{
          drawerLabel: "Invitations",
          title: "Invitations",
          drawerIcon: () => (
            <FontAwesome name="envelope" size={24} color={colors.gray} />
          ),
        }}
      />
      <Drawer.Screen
        name="profil"
        options={{
          drawerLabel: "Mon Profil",
          title: "Mon Profil",
          drawerIcon: () => (
            <MaterialIcons name="person" size={24} color={colors.gray} />
          ),
        }}
      />
    </Drawer>
  );
}
