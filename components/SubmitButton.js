import { Pressable, StyleSheet } from "react-native";

const SubmitButton = () => {
  return (
    <Pressable>
      <Text>Se connecter</Text>
    </Pressable>
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
export default SubmitButton;
