import { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../assets/colors/colors.json";

const Input = ({ title, type, placeholder, setState, value }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isEmail = type === "email";
  const isDate = type === "date";

  // used by DateTimePickerAndroid
  const [date, setDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        setDate(selectedDate);
        setIsDateSelected(true);
        setState(date);
      },
      mode: "date",
    });
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>{title}</Text>
      {isDate ? (
        <Pressable style={styles.inputRow} onPress={showDatepicker}>
          <Text style={styles.input}>
            {isDateSelected ? formatDate(date) : "jj/mm/aaaa"}
          </Text>
          <Text style={styles.icon}>
            <MaterialIcons
              name="calendar-month"
              size={20}
              color={colors.lightgray}
            />
          </Text>
        </Pressable>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={setState}
            value={value}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={isEmail ? "email-address" : "default"}
            autoCapitalize={isEmail || isPassword ? "none" : "sentences"}
            autoComplete={isEmail ? "email" : undefined}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={22}
                color={colors.lightgray}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  inputContainer: {
    width: "100%",
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  input: {
    flex: 1,
    padding: 10,
    color: colors.lightgray,
  },
  icon: {
    padding: 10,
  },
});
export default Input;
