import { AuthProvider } from "../context/AuthContext";
import RootNavigator from "../navigation/RootNavigator";

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
