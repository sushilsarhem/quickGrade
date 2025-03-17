// import { View, Text,TouchableOpacity,TextInput } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import { updateProfile, appLogout } from '@/config/appwriteConfig'
// import { useRouter } from 'expo-router'
// import { UserContext } from '@/context/GlobalProvider'

// const Profile = () => {
//   const router = useRouter();
//   const { user, setUser } = useContext(UserContext);

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [fullname, setFullname] = useState("");
//   const [standard, setStandard] = useState("");
//   const [email, setEmail] = useState("");
//   const [section, setSection] = useState("");

  

//   useEffect(()=>{
//       if(user){
//         setName(user.name);
//         setEmail(user.email);
//         console.log(user.email,user.name);
//       }
//       },[user])

//   const handleProfileUpdate =async()=>{
//     const userId= user.$id;
//     try {
//       const classStandard= parseInt(standard);
//       const res = await updateProfile(userId,name,fullname,classStandard,email,phone,section);
//       // console.log(res);
//       if(res){
//         setUser(res);
//         router.push("/(auth)/dashboard")
//       }
//     } catch (error) {
//       console.log(error);
      
//     }
      
      
      
//   }

//   const handleLogout = async () => {
//     try {
//       await appLogout();
//       setUser(null);
//       router.push("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };
//   // if(user){
//   // console.log(user);

//   // }
  
  
  
  
//   return (
//     <View className='flex-1 justify-center bg-slate-900'>
//       <Text className='text-white text-2xl text-center my-2'>Complete your profile</Text>

//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={`${user?user.name:name}`}
//                   placeholder={`${user?user.name:'username'}`}
//                   onChangeText={setName}/>
      
//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={fullname}
//                   placeholder="fullname"
//                   onChangeText={setFullname}/>
      
//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={standard}
//                   placeholder="standard"
//                   keyboardType="numeric"
//                   onChangeText={setStandard}/>

//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={`${user?user.email:email}`}
//                   placeholder={`${user?user.email:'email address'}`}
//                   onChangeText={setEmail}/>

//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={phone}
//                   placeholder="phone number"
//                   keyboardType="numeric"
//                   onChangeText={setPhone}/>

//       <TextInput className='bg-white text-2xl text-center my-2 rounded-lg m-5'
//                   style={{ height: 45 }}
//                   value={section}
//                   placeholder="section"
//                   onChangeText={setSection}/>

      

//       <TouchableOpacity 
//                 className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
//                 onPress={handleProfileUpdate}>
//                 <Text className='text-center text-3xl text-white bg-primary'>Update</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//                 className='bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5'
//                 onPress={handleLogout}>
//                 <Text className='text-center text-3xl text-white bg-primary'>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Profile

import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { updateProfile, appLogout } from "@/config/appwriteConfig";
import { Redirect, useRouter } from "expo-router";
import { UserContext } from "@/context/GlobalProvider";

const Profile = () => {
  const router = useRouter();
  const { user, setUser, isLogged } = useContext(UserContext);

  // Early return before hooks
  if (!isLogged) {
    return <Redirect href="/(auth)/login" />;
  }

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");
  const [standard, setStandard] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setFullname(user.fullname || "");
      setStandard(user.standard != null ? user.standard.toString() : "");
      setEmail(user.email || "");
      setSection(user.section || "");
    } else {
      console.log("User is undefined or null.");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    const userId = user.$id;
    try {
      const classStandard = parseInt(standard);
      const res = await updateProfile(userId, name, fullname, classStandard, email, phone, section);
      if (res) {
        setUser(res);
        router.push("/(auth)/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  return (
    <View className="flex-1 justify-center bg-zinc-800">
      <Text className="text-yellow-400 text-3xl text-center my-2">iNFO</Text>

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{height: 48,borderColor:'#d2341f',borderWidth:2,backgroundColor:'#f4bdb6'}}
        value={name}
        placeholder="username"
        // onChangeText={setName}
        editable={false}
      />

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{ height: 45 }}
        value={fullname}
        placeholder="fullname"
        onChangeText={setFullname}
      />

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{ height: 45 }}
        value={standard}
        placeholder="standard"
        keyboardType="numeric"
        onChangeText={setStandard}
      />

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{height: 48,borderColor:'#d2341f',borderWidth:2,backgroundColor:'#f4bdb6'}}
        value={email}
        placeholder="email address"
        // onChangeText={setEmail}
        editable={false}
      />

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{ height: 45 }}
        value={phone}
        placeholder="phone number"
        keyboardType="numeric"
        onChangeText={setPhone}
      />

      <TextInput
        className="bg-white text-2xl text-center my-2 rounded-lg m-5"
        style={{ height: 45 }}
        value={section}
        placeholder="section"
        onChangeText={setSection}
      />

      <TouchableOpacity className="bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5" onPress={handleProfileUpdate}>
        <Text className="text-center text-3xl text-white">SAVE</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity className="bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5" onPress={handleLogout}>
        <Text className="text-center text-3xl text-white">Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Profile;
