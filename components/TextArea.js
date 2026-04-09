import { Text, TextInput, StyleSheet } from "react-native";
import s from "../styles/addGiftStyles";

export default function TextArea({ title, placeholder, value, onChangeText, onFocus }) {
  return (
    <>
      {title && <Text style={s.label}>{title}</Text>}
      <TextInput
        style={styles.textArea}
        placeholder={placeholder}
        multiline
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
});
