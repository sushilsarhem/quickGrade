import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { appLogout, signupApp } from '@/config/appwriteConfig';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/GlobalProvider';

const Signup = () => {
    const {user,setUser,setIsLogged} = useContext(UserContext);
    const [email,setEmail] = useState('');
    const [password, setPassword]=useState('');
    const [name, setName]=useState('');
    const [errorMessage,setErroMessage] = useState(false)
    const router = useRouter();

    const handleSignup = async()=>{
        if(!email || !password || !name){
            setErroMessage(true)
            return;
        }
        try {
            const afterSignin = await signupApp(email,password,name);
            if(afterSignin){
                setUser(afterSignin);
                setIsLogged(true);
                router.replace("/(auth)/dashboard")
            }
        } catch (error) {
            console.log("invalid input:",error);
            
        }        
    }
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
        <Text className='text-white text-2xl text-center my-2'>Sign up</Text>
        
        
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
            <TextInput 
                className='bg-white text-2xl text-center my-2 rounded-lg m-5'
                style={{ height: 45 }}
                value={name}
                placeholder="username"
                onChangeText={setName}
            />
            <TouchableOpacity 
                className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                onPress={handleSignup}>
                <Text className='text-center text-3xl text-white bg-primary'>Signup</Text>
            </TouchableOpacity>
            <Link className='text-white text-center m-5' href="/(auth)/login">click here to Login</Link>

            {/* for testing purpose only */}
            {/* <TouchableOpacity 
                className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
                onPress={appLogout}>
                <Text className='text-center text-3xl text-white bg-primary'>Logout</Text>
            </TouchableOpacity> */}
        </View>
  )
}

export default Signup