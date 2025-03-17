import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import FetchStudents from '@/components/FetchStudents'
import { useLocalSearchParams } from 'expo-router';
import { formatAsssesmentName } from '@/config/appwriteConfig';


const Assessment1 = () => {
  const { assesstmentType,teacherId } = useLocalSearchParams();


  
  
  
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
        <Text className='text-yellow-400 font-bold text-3xl text-center my-2'>
        {formatAsssesmentName(assesstmentType)}
        </Text>
        <FetchStudents assestType={assesstmentType} teacherId={teacherId} />
    </View>
  )
}

export default Assessment1