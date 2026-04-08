// AddGiftForm: form to create a new gift or wish.
// mode="gift" -> gift with name + price (for birthday events)
// mode="wish" -> wish with name + description (for christmas lists)

import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../utils/api";
import showError from "../utils/showError";
import useImagePicker from "../utils/useImagePicker";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import Title from "./Title";
import FilledIcon from "./FilledIcon";
import TextArea from "./TextArea";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";
import s from "../styles/addGiftStyles";

export default function AddGiftForm({ eventId, ownerId, mode = "gift" }) {
  const router = useRouter();
  const isWish = mode === "wish";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { image, pickFromCamera, pickFromGallery, clearImage } = useImagePicker();
  const [form, setForm] = useState({
    name: "",
    price: "",
    link: "",
    description: "",
  });

  // Validate, build FormData (with optional image), and POST to /gift/create
  const handleSubmit = async () => {
    if (isWish && !form.name) {
      return Alert.alert("Erreur", "Le nom est obligatoire");
    }
    if (!isWish && (!form.name || !form.price)) {
      return Alert.alert("Erreur", "Le nom et le prix sont obligatoires");
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", isWish ? 0 : form.price);
      formData.append("link", form.link);
      formData.append("event", eventId);
      if (isWish) {
        formData.append("owner", ownerId);
        formData.append("descritption", form.description);
      }
      // Attach the picked image in the format React Native expects for multipart upload
      if (image) {
        const filename = image.split("/").pop();
        const ext = filename.split(".").pop();
        formData.append("image", {
          uri: image,
          name: filename,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      }
      await api.post("/gift/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const successMsg = isWish ? "Souhait ajouté !" : "Cadeau ajouté !";
      Alert.alert("Succès", successMsg, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      showError(error);
    }
    setIsSubmitting(false);
  };

  // Dynamic labels based on gift vs wish mode
  const label = isWish ? "souhait" : "cadeau";
  const headerTitle = isWish ? "Ajouter un souhait" : "Ajouter un cadeau";
  const title = isWish ? "NOUVEAU SOUHAIT" : "AJOUTER UN CADEAU";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{headerTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Title text={title} heading="h1" />

        <Input
          title="Nom"
          placeholder={isWish ? "Nom du souhait" : "Ex: Livre - Le Seigneur des Anneaux"}
          setState={(v) => setForm({ ...form, name: v })}
          value={form.name}
        />

        {!isWish && (
          <Input
            title="Prix (€)"
            placeholder="Ex: 25"
            type="price"
            setState={(v) => setForm({ ...form, price: v.replace(/[^0-9]/g, "") })}
            value={form.price}
          />
        )}

        {isWish && (
          <Input
            title="Lien (optionnel)"
            placeholder="Lien vers le produit"
            setState={(v) => setForm({ ...form, link: v })}
            value={form.link}
          />
        )}

        <Text style={s.label}>Image du {label}</Text>
        <View style={s.imageButtons}>
          <FilledIcon onPress={pickFromCamera}>
            <MaterialIcons name="photo-camera" size={30} color="white" />
          </FilledIcon>
          <FilledIcon onPress={pickFromGallery}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </FilledIcon>
          {image && (
            <FilledIcon onPress={clearImage} red>
              <MaterialIcons name="delete" size={30} color="white" />
            </FilledIcon>
          )}
        </View>

        <View style={s.imagePreview}>
          {image ? (
            <Image source={{ uri: image }} style={s.previewImage} />
          ) : (
            <>
              <MaterialIcons name="image" size={40} color={colors.gray} />
              <Text style={s.previewText}>Aucune image sélectionnée</Text>
            </>
          )}
        </View>

        {!isWish && (
          <Input
            title="Lien vers le produit (optionnel)"
            placeholder="https://example.com/produit"
            setState={(v) => setForm({ ...form, link: v })}
            value={form.link}
          />
        )}

        {isWish && (
          <TextArea
            title="Description (optionnelle)"
            placeholder="Description du souhait"
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
          />
        )}

        <SubmitButton
          text={isWish ? "Ajouter" : "Ajouter le cadeau"}
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
