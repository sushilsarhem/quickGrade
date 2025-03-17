import { Redirect, Stack } from "expo-router";
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
        <Stack.Screen name="exams" options={{title:'Exams',headerShown:false}} />
        <Stack.Screen name="assessment1" options={{title:'Assessment1',headerShown:false}} />
        <Stack.Screen name="settings" options={{title:'Settings',headerShown:false}} />
        <Stack.Screen name="setboard" options={{title:'SetBoard',headerShown:false}} />
        <Stack.Screen name="savedlist" options={{title:'Savedlist',headerShown:false}} />
        <Stack.Screen name="details/[enterMarksDetails]" options={{title:'EnterMarksDetails',headerShown:false}} />
      </Stack>
    
    );
}

