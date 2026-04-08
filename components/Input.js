import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  Platform,
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

  const [date, setDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const onDateChange = (_event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      setIsDateSelected(true);
      setState(selectedDate);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>{title}</Text>
      {isDate ? (
        <>
          <Pressable
            style={styles.inputRow}
            onPress={() => setShowPicker(true)}>
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
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              firstDayOfWeek={1}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}
          {Platform.OS === "ios" && showPicker && (
            <Pressable onPress={() => setShowPicker(false)}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.green,
                  padding: 8,
                }}>
                Confirmer
              </Text>
            </Pressable>
          )}
        </>
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
    fontWeight: "bold",
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
