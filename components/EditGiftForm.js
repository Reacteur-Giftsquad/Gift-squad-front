import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "../utils/api";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import Title from "./Title";
import FilledIcon from "./FilledIcon";
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
  const [image, setImage] = useState(initialImage || null);
  const [form, setForm] = useState({
    name: initialName,
    price: initialPrice,
    link: initialLink,
    description: initialDescription,
  });

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "Permission refusée",
        "L'accès à la caméra est nécessaire",
      );
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert(
        "Permission refusée",
        "L'accès à la galerie est nécessaire",
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

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
      formData.append("price", Number(form.price));
      formData.append("link", form.link);
      if (image) {
        const filename = image.split("/").pop();
        const ext = filename.split(".").pop();
        formData.append("image", {
          uri: image,
          name: filename,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      }

      if (isWish) formData.append("description", form.description);

      await api.put(`/gift/modify/${giftId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const successMsg = isWish ? "Souhait modifié !" : "Cadeau modifié !";
      Alert.alert("Succès", successMsg, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Erreur");
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    }
    setIsSubmitting(false);
  };

  const label = isWish ? "souhait" : "cadeau";
  const headerTitle = isWish ? "Modifier mon souhait" : "Modifier un cadeau";
  const title = isWish ? "MODIFIER LE SOUHAIT" : "MODIFIER UN CADEAU";

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

        <Text style={s.label}>Image du {label}</Text>
        <View style={s.imageButtons}>
          <FilledIcon onPress={pickFromCamera}>
            <MaterialIcons name="photo-camera" size={30} color="white" />
          </FilledIcon>
          <FilledIcon onPress={pickFromGallery}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </FilledIcon>
          {image && (
            <FilledIcon onPress={() => setImage(null)} red>
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

        {isWish && (
          <>
            <Text style={s.label}>Description (optionnelle)</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#d1d1d1",
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                minHeight: 80,
                textAlignVertical: "top",
              }}
              placeholder="Description du souhait"
              multiline
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
            />
          </>
        )}

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
