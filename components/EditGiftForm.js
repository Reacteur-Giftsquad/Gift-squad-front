// EditGiftForm: form to edit or delete an existing gift/wish.
// Same layout as AddGiftForm but pre-filled with initial values.
// Includes a delete button with confirmation alert.

import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
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

export default function EditGiftForm({
  giftId,
  initialName = "",
  initialPrice = "",
  initialLink = "",
  initialImage = "",
  initialDescription = "",
  mode = "gift",
}) {
  const router = useRouter();
  const isWish = mode === "wish";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { image, pickFromCamera, pickFromGallery, clearImage } = useImagePicker(
    initialImage || null,
  );
  const [form, setForm] = useState({
    name: initialName,
    price: initialPrice,
    link: initialLink,
    description: initialDescription,
  });

  // Show confirmation alert then delete via API
  const handleDelete = () => {
    const label = isWish ? "ce souhait" : "ce cadeau";
    Alert.alert(`Supprimer ${label}`, "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/gift/${giftId}`);
            router.back();
          } catch (error) {
            Alert.alert(
              "Erreur",
              error.response?.data?.message || "Erreur serveur",
            );
          }
        },
      },
    ]);
  };

  // Validate, build FormData, and PUT to /gift/modify/:id
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
      formData.append("price", isWish ? 0 : Number(form.price));
      formData.append("link", form.link);
      if (isWish) {
        formData.append("description", form.description);
      }
      if (image) {
        const filename = image.split("/").pop();
        const ext = filename.split(".").pop();
        formData.append("image", {
          uri: image,
          name: filename,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      }
      await api.put(`/gift/modify/${giftId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const successMsg = isWish ? "Souhait modifié !" : "Cadeau modifié !";
      Alert.alert("Succès", successMsg, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      showError(error);
    }
    setIsSubmitting(false);
  };

  const label = isWish ? "souhait" : "cadeau";
  const title = isWish ? "MODIFIER LE SOUHAIT" : "MODIFIER UN CADEAU";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={s.container}>
      <ScrollView contentContainerStyle={s.content}>
        <Title text={title} heading="h1" />

        <Input
          title="Nom"
          placeholder={
            isWish ? "Nom du souhait" : "Ex: Livre - Le Seigneur des Anneaux"
          }
          setState={(v) => setForm({ ...form, name: v })}
          value={form.name}
        />

        {!isWish && (
          <Input
            title="Prix (€)"
            placeholder="Ex: 25"
            type="price"
            setState={(v) =>
              setForm({ ...form, price: v.replace(/[^0-9]/g, "") })
            }
            value={form.price}
          />
        )}

        <Input
          title={
            isWish ? "Lien (optionnel)" : "Lien vers le produit (optionnel)"
          }
          placeholder={
            isWish ? "Lien vers le produit" : "https://example.com/produit"
          }
          setState={(v) => setForm({ ...form, link: v })}
          value={form.link}
        />

        {isWish && (
          <TextArea
            title="Description (optionnelle)"
            placeholder="Description du souhait"
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
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

        <SubmitButton
          text={isWish ? "Enregistrer" : "Modifier le cadeau"}
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <SubmitButton
          text={`Supprimer ${label === "souhait" ? "ce souhait" : "le cadeau"}`}
          onPress={handleDelete}
          bgColor={colors.red}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
