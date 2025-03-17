import { Stack,Redirect } from "expo-router";
// Import your global CSS file
import "../../global.css";



export default function RootLayout() {
  
  return (
    
      <Stack>
        <Stack.Screen name="signup" options={{title:'Signup',headerShown:false}} />
        <Stack.Screen name="login" options={{title:'Login',headerShown:false}} />
        <Stack.Screen name="profile" options={{title:'Profile',headerShown:false}} />
        <Stack.Screen name="dashboard" options={{title:'Dashboard',headerShown:false}} />
      </Stack>
    
    );
}

