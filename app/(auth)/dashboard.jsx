import { View, Text,Pressable } from 'react-native'
import { Link, Redirect } from 'expo-router'
import React, { useEffect } from 'react'
import { appLogout } from '@/config/appwriteConfig'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { UserContext } from '@/context/GlobalProvider'
import { useContext } from 'react'


const Dashboard = () => {
    const router= useRouter();
    const {user,setUser,isLogged,setIsLogged}= useContext(UserContext);
    
    const handleLogout = async () => {
        try {
          await appLogout();
          setIsLogged(false);
          setUser(null);
          router.push("/(auth)/login");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

      // console.log(user);
      // to prevent unauthorized access
      if(!isLogged){
        return <Redirect href="/(auth)/login"/>
      }
      
      
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
        <Text className='text-yellow-400 font-bold text-3xl text-center my-2'>{`${user?user.name:"Dashboard"}`}</Text>

        <View className='flex justify-center items-center'>
          {/* <ProfileImage /> */}
        </View>

        <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            alignItems: "center",
                            marginVertical: 10,
                          }} 
                          onPress={() => router.push("/(auth)/profile")}>
                    <Text className='text-center text-3xl text-white bg-primary'>Profile</Text>
              {/* <Link className='text-center text-3xl text-white bg-primary' 
                    href="/(auth)/profile">Profile</Link> */}
        </TouchableOpacity>

        <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            alignItems: "center",
                            marginVertical: 10,
                          }} 
                          onPress={() => router.push("/(student)/students")}>
                    <Text className='text-center text-3xl text-white bg-primary'>Students</Text>
              {/* <Link className='text-center text-3xl text-white bg-primary' 
                    href="/(student)/students">Students</Link> */}
        </TouchableOpacity>

        <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            alignItems: "center",
                            marginVertical: 10,
                          }} 
                          onPress={() => router.push("/(exams)/exams")}>
                    <Text className='text-center text-3xl text-white bg-primary'>Exams</Text>
              {/* <Link className='text-center text-3xl text-white bg-primary' 
                    href="/(exams)/exams">Exams</Link> */}
        </TouchableOpacity>

        <TouchableOpacity className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            alignItems: "center",
                            marginVertical: 10,
                          }} 
                          onPress={() => router.push("/(results)/results")}>
              {/* <Link className='text-center text-3xl text-white bg-primary' 
                    href="/(results)/results">Results</Link> */}
                    <Text className='text-center text-3xl text-white bg-primary'>Results</Text>
        </TouchableOpacity>

        <TouchableOpacity  className="bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5"
            style={{
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginVertical: 10,
                  }} 
            onPress={() => router.push("/(exams)/setboard")}>
            <Text className='text-center text-3xl text-white bg-primary'>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
                className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                onPress={handleLogout}>
                <Text className='text-center text-3xl text-white bg-primary'>Logout</Text>
        </TouchableOpacity>

        
    </View>
  )
}

export default Dashboard