import { useContext, useEffect } from "react";
import { UserContext } from "@/context/GlobalProvider";
import { useRouter, useSegments } from "expo-router";
import { View, Text } from "react-native";

const ProtectedRoute = ({ children }) => {
  const { isLogged } = useContext(UserContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLogged && segments[0] !== "(auth)") {
      console.log("Unauthorized access, redirecting to login...");
      router.replace("/(auth)/login");
    }
  }, [isLogged, segments]);

  if (!isLogged) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-white">Redirecting...</Text>
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
