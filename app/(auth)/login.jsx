import { View, Text,TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useState,useContext } from 'react'
import { loginApp } from '../../config/appwriteConfig'
import { Link } from 'expo-router'
import { appLogout } from '../../config/appwriteConfig'
import { useRouter } from 'expo-router'
import { UserContext } from '@/context/GlobalProvider'


const Login = () => {
    const {setUser,setIsLogged} = useContext(UserContext);
    const [email,setEmail] = useState('')
    const [password, setPassword]=useState('')    
    const [errorMessage,setErroMessage] = useState(false)
    
    const router = useRouter();

    const handleLogin =async() =>{
        if(!email || !password ){
            setErroMessage(true)
            return;
        }

        // if (email && password) {
            try {
                const res = await loginApp(email, password); // Await the result

                if (!res) {
                    Alert.alert('Error', 'Account not found. Please contact support.');
                    return; // Stop login if no profile exists
                } 
                setUser(res);
                setIsLogged(true);
                // console.log(res);
                router.replace("/(auth)/dashboard"); // Navigate to profile on success
               
                // console.log('Navigating to Profile...');
                    
                
            } catch (error) {
                Alert.alert('Error', error.message || 'Login failed');
            }
        
        // } else {
        //     Alert.alert('Error', 'Please enter both email and password');
        // }
    }

    
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
        <Text className='text-white text-2xl text-center my-2'>Login</Text>

        {errorMessage ? (
            <View className="flex items-center justify-center bg-red-300 mx-5 rounded-lg h-12">
            <Text className="text-lg text-black text-center">
              ** Please fill in all the input fields! **
            </Text>
            </View>
          ) : null}

        <TextInput 
            className='bg-white text-2xl text-center my-2 rounded-lg m-5'
            style={{ height: 45 }}
            value={email}
            placeholder="email address"
            onChangeText={setEmail}
        />
        <TextInput 
            className='bg-white text-2xl text-center my-2 rounded-lg m-5'
            style={{ height: 45 }}
            value={password}
            placeholder="password"
            onChangeText={setPassword}
        />
        <TouchableOpacity 
            className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
            onPress={handleLogin}>
            <Text className='text-center text-3xl text-white bg-primary'>Login</Text>
        </TouchableOpacity>
        <Link className='text-white text-center m-5' href="/(auth)/signup">click here to Sign up</Link>
        

            {/* for testing purpose only */}

        {/* <TouchableOpacity 
                className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                onPress={appLogout}>
                <Text className='text-center text-3xl text-white bg-primary'>Logout</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default Login

