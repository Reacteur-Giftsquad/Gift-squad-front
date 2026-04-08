// CreateEvent: form to create a new event (title, date, budget).
// The event type is passed via route params from the type selection screen.

import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../utils/api";
import showError from "../../../utils/showError";
import { useAuth } from "../../../context/AuthContext";
import styles from "../../../styles/globals";
import Input from "../../../components/Input";
import SubmitButton from "../../../components/SubmitButton";
import Title from "../../../components/Title";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ScreenWithMenu from "../../../components/ScreenWithMenu";

// Maps route param keys to display labels
const TYPE_LABELS = {
  secretSanta: "Secret Santa",
  birthday: "Anniversaire",
  christmasList: "Liste de Noël",
};

export default function CreateEvent() {
  const { type } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    budget: "",
  });

  const handleCreate = async () => {
    if (!form.title || !form.date) {
      return Alert.alert("Erreur", "Le titre et la date sont obligatoires");
    }

    setIsSubmitting(true);
    try {
      await api.post("/events/create", {
        name: form.title,
        type: TYPE_LABELS[type] || type,
        date: form.date,
        budget: form.budget,
        creator: user._id,
      });
      Alert.alert("Succes", "Événement créé !", [
        { text: "OK", onPress: () => router.replace("/(main)/events") },
      ]);
    } catch (error) {
      showError(error, "Erreur lors de la création");
    }
    setIsSubmitting(false);
  };

  return (
    <ScreenWithMenu title="Créer un événement">
      <ScrollView contentContainerStyle={styles.content}>
        <Title text={TYPE_LABELS[type] || "Nouvel événement"} heading="h1" />
        <Input
          title="Titre"
          placeholder="Nom de l'événement"
          setState={(v) => setForm({ ...form, title: v })}
          value={form.title}
        />
        <Input
          title="Date"
          setState={(v) => setForm({ ...form, date: v })}
          type="date"
        />
        <Input
          title="Budget"
          placeholder="Ex: 20€"
          setState={(v) => setForm({ ...form, budget: v })}
          value={form.budget}
        />
        <SubmitButton
          text="Créer l'événement"
          icon={<MaterialIcons name="add" size={24} color="white" />}
          onPress={handleCreate}
          isSubmitting={isSubmitting}
        />
      </ScrollView>
    </ScreenWithMenu>
  );
}
