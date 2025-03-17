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
        <Stack.Screen name="results" options={{title:'Results',headerShown:false}} />
        <Stack.Screen name="ranks" options={{title:'Ranks',headerShown:false}} />
        <Stack.Screen name="[rankDetails]" options={{title:'RankDetails',headerShown:false}} />
      </Stack>
    
    );
}

