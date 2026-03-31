import { StyleSheet, Text, TextInput, View } from "react-native";

const Input = ({ title, type, placeholder, setState, value }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={setState}
        value={value}
        secureTextEntry={type === "password"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  input: {
    padding: 10,
  },
});
export default Input;
