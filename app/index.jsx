import {Text,TouchableOpacity,View } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/GlobalProvider";



export default function Index() {
  const {user,isLogged} = useContext(UserContext);
  // const router = useRouter();

  if (isLogged && user) return <Redirect href="/(auth)/dashboard" />;

  

  
  
  
  return (
    
      <View className="flex-1 justify-center bg-zinc-800">
      <Text className="text-center text-yellow-400 text-4xl">QuickGrade</Text>

      <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'>
        <Link className='text-center text-3xl text-white bg-primary' href="/(auth)/signup">Register</Link>
      </TouchableOpacity>

      <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'>
        <Link className='text-center text-3xl text-white bg-primary' href="/(auth)/login">Login</Link>
      </TouchableOpacity>

            {/* for testing purpose only */}

      {/* <TouchableOpacity 
                className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                onPress={appLogout}>
                <Text className='text-center text-3xl text-white bg-primary'>Logout</Text>
      </TouchableOpacity> */}

      </View>     
      
      
    
  );
}
