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
import Title from "../../components/Title";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors/colors.json";
import s from "../../styles/addGiftStyles";

export default function EditGift() {
  const { giftId, giftName, giftPrice, giftLink, giftImage } =
    useLocalSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(giftImage || null);
  const [form, setForm] = useState({
    name: giftName || "",
    price: giftPrice || "",
    link: giftLink || "",
  });

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission refusée", "L'accès à la caméra est nécessaire");
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
      return Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
          } catch (error) {
            Alert.alert("Erreur", error.response?.data?.message || "Erreur serveur");
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      return Alert.alert("Erreur", "Le nom et le prix sont obligatoires");
    }

    setIsSubmitting(true);
    try {
      await api.put(`/gift/modify/${giftId}`, {
        name: form.name,
        price: Number(form.price),
        link: form.link,
      });
      Alert.alert("Succès", "Cadeau modifié !", [
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
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Modifier un cadeau</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Title text="MODIFIER UN CADEAU" heading="h1" />

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
          setState={(v) => setForm({ ...form, price: v.replace(/[^0-9]/g, "") })}
          value={form.price}
        />

        <Text style={s.label}>Image du cadeau</Text>
        <View style={s.imageButtons}>
          <TouchableOpacity style={s.imageBtn} onPress={pickFromCamera}>
            <MaterialIcons name="photo-camera" size={30} color="white" />
          </TouchableOpacity>
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
          placeholder="https://example.com/produit"
          setState={(v) => setForm({ ...form, link: v })}
          value={form.link}
        />

        <SubmitButton
          text="Modifier le cadeau"
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <TouchableOpacity
          style={{
            backgroundColor: colors.red,
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 12,
          }}
          onPress={handleDelete}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Supprimer le cadeau
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
