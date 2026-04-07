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
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "../../utils/api";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";
import Title from "../../components/Title";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors/colors.json";
import s from "../../styles/addGiftStyles";
import { useBehavior } from "../../utils/useBehavior";
import FilledIcon from "../../components/FilledIcon";

export default function AddGift() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const behaviour = useBehavior();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    link: "",
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
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      return Alert.alert("Erreur", "Le nom et le prix sont obligatoires");
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("link", form.link);
      formData.append("event", eventId);
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
      Alert.alert("Succès", "Cadeau ajouté !", [
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

  return (
    <KeyboardAvoidingView
      behavior={behaviour}
      enabled={Platform.OS === "android"}
      style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Ajouter un cadeau</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Title text="AJOUTER UN CADEAU" heading="h1" />

        <Input
          title="Nom"
          placeholder="Ex: Livre - Le Seigneur des Anneaux"
          setState={(v) => setForm({ ...form, name: v })}
          value={form.name}
        />
        <Input
          title="Prix (€)"
          placeholder="Ex: 25"
          type="price"
          setState={(v) =>
            setForm({ ...form, price: v.replace(/[^0-9]/g, "") })
          }
          value={form.price}
        />

        <Text style={s.label}>Image du cadeau</Text>
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

        <Input
          title="Lien vers le produit (optionnel)"
          placeholder="https://example.com/produit"
          setState={(v) => setForm({ ...form, link: v })}
          value={form.link}
        />

        <SubmitButton
          text="Ajouter le cadeau"
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
