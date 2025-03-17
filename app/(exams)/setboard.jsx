import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'


const SetBoard = () => {
    const router= useRouter();
    
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
      <Text className='text-yellow-400 font-bold text-3xl  text-center my-2'>Manage Assessments</Text>

        <TouchableOpacity  className="bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5"
                  style={{
                          padding: 12,
                          borderRadius: 10,
                          alignItems: "center",
                          marginVertical: 10,
                        }} 
                  onPress={() => router.push("/(exams)/savedlist")}>
                  <Text className='text-center text-3xl text-white bg-primary'>Assessment Lists</Text>
        </TouchableOpacity>

        <TouchableOpacity  className="bg-teal-700 w-100 h-auto p-3 rounded-lg my-2 m-5"
                  style={{
                          padding: 12,
                          borderRadius: 10,
                          alignItems: "center",
                          marginVertical: 10,
                        }} 
                  onPress={() => router.push("/(exams)/settings")}>
                  <Text className='text-center text-3xl text-white bg-primary'>Set Assessments</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SetBoard