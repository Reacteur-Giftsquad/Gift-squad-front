import { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "../../utils/api";
import Input from "../../components/Input";
import SubmitButton from "../../components/SubmitButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors/colors.json";
import s from "../../styles/addGiftStyles";

export default function EditGift() {
  const { giftId, name, price, link, image_url } = useLocalSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(image_url || null);
  const [form, setForm] = useState({
    name: name || "",
    price: price || "",
    link: link || "",
  });

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Permission refusée", "Accès galerie nécessaire");
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.price)
      return Alert.alert("Erreur", "Le nom et le prix sont obligatoires");

    setIsSubmitting(true);
    try {
      await api.put(`/gift/${giftId}`, {
        name: form.name,
        price: Number(form.price),
        link: form.link,
        image_url: image || "",
      });
      Alert.alert("Succès", "Cadeau modifié !", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Erreur", err.response?.data?.message || "Erreur serveur");
    }
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    Alert.alert("Supprimer ce cadeau", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/gift/${giftId}`);
            router.back();
          } catch (err) {
            Alert.alert(
              "Erreur",
              err.response?.data?.message || "Erreur serveur",
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      {/* Header avec bouton delete */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Modifier le cadeau</Text>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Input
          title="Nom"
          value={form.name}
          setState={(v) => setForm({ ...form, name: v })}
        />
        <Input
          title="Prix"
          value={form.price}
          placeholder="Ex: 25"
          setState={(v) => setForm({ ...form, price: v })}
        />

        <Text style={s.label}>Image du cadeau</Text>
        <View style={s.imageButtons}>
          <TouchableOpacity style={s.imageBtn} onPress={pickFromGallery}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </TouchableOpacity>
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
          value={form.link}
          placeholder="https://example.com/produit"
          setState={(v) => setForm({ ...form, link: v })}
        />

        <SubmitButton
          text="Enregistrer les modifications"
          onPress={handleUpdate}
          isSubmitting={isSubmitting}
        />
      </ScrollView>
    </View>
  );
}
