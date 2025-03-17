import { Stack,Redirect } from "expo-router";
// Import your global CSS file
import "../../global.css";
import { UserContext } from "@/context/GlobalProvider";
import { useContext } from "react";


export default function RootLayout() {
  const {isLogged} = useContext(UserContext);

  if(!isLogged){
        return <Redirect href="/(auth)/login"/>
      }

  return (
      <Stack>
        <Stack.Screen name="students" options={{title:'Students',headerShown:false}} />
      </Stack>
    
    );
}

