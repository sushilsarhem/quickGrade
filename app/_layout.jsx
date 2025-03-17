import { Stack  } from "expo-router";
// Import your global CSS file
import "../global.css";
import Layout from "@/components/Layout";
import { UserProvider } from "@/context/GlobalProvider";


export default function RootLayout() {
  

  
  return (
    <UserProvider>
      <Layout>
        <Stack>
          <Stack.Screen name="index" options={{title:'Home',headerShown:false}} />
          <Stack.Screen name="(auth)" options={{headerShown:false}} />
          <Stack.Screen name="(student)" options={{headerShown:false}} />
          <Stack.Screen name="(exams)" options={{headerShown:false}} />
          <Stack.Screen name="(results)" options={{headerShown:false}} />
        </Stack>
      </Layout>
    </UserProvider>
    );
}

