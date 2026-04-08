// Displays an error alert: shows the server message if available, otherwise a fallback.
import { Alert } from "react-native";

export default function showError(error, fallback = "Impossible de se connecter au serveur") {
  if (error.response) {
    Alert.alert("Erreur", error.response.data.message || fallback);
  } else {
    Alert.alert("Erreur", fallback);
  }
}
