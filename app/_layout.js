// Root layout: wraps the entire app with the AuthProvider context.

import { AuthProvider } from "../context/AuthContext";
import RootNavigator from "../navigation/RootNavigator";

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
