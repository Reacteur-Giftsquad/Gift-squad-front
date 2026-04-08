// useBehavior: returns the right KeyboardAvoidingView behavior value.
// On Android, disables the behavior when keyboard is hidden to avoid layout glitches.

import { Keyboard, Platform } from "react-native";
import { useEffect, useState } from "react";

export function useBehavior() {
  const defaultValue = Platform.OS === "ios" ? "padding" : "height";

  const [behaviour, setBehaviour] = useState(defaultValue);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour(defaultValue);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return behaviour;
}
